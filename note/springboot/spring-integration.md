---
title: Spring Integration
sidebar_position: 12
---

# Spring Integration



### 概念

消息通道 (Message Channel)

消息传递的管道，连接各个组件：

例如：

* 直接通道 (DirectChannel)：同步，同一线程执行，发送者会阻塞直到消息被接收
* 队列通道 (QueueChannel)：异步，基于队列实现

集成流 (Integration Flow)

定义消息从输入到输出的完整处理路径


网关 (Gateway)

集成流的入口，将数据传递给集成流。业务代码可以通过 Gateway 调用集成流

Transformer 

将消息转为其他格式

### file

将字符串转为大写写入文件

流程：

```
Gateway -> textInChannel -> upper case transformer -> fileWriteChannel -> file write handler
```


依赖

```
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.10'
    id 'io.spring.dependency-management' version '1.1.7'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-integration'
    implementation 'org.springframework.integration:spring-integration-file'
}
```

定义 Flow

```java
@Configuration
public class FileWriterIntegrationConfig {

    @Value("${file.path}")
    private String filePath;

    public FileWritingMessageHandler fileWriter() {
        FileWritingMessageHandler handler =
                new FileWritingMessageHandler(new File(dirPath));
        handler.setExpectReply(false);
        handler.setFileExistsMode(FileExistsMode.APPEND);
        handler.setAppendNewLine(true);
        handler.setExpectReply(false);
        handler.setFileExistsMode(FileExistsMode.APPEND);
        handler.setAppendNewLine(true);
        handler.setFileNameGenerator(message -> "output.txt");
        handler.setAutoCreateDirectory(true);
        handler.setCharset("UTF-8");
        return handler;
    }

    @Bean
    public IntegrationFlow fileWriterFlow() {
        return IntegrationFlow
                .from(MessageChannels.direct("textInChannel"))
                .<String, String>transform(t -> t.toUpperCase())
                .channel(MessageChannels.direct("fileWriterChannel"))
                .handle(fileWriter())
                .get();
    }
}
```

定义 Gateway



```java
@MessagingGateway
public interface MyStringGateway {
    @Gateway(requestChannel = "textInChannel")
    void send(String message);
}
```

传入字符串到 Gateway

```java
@SpringBootTest
class TestFile {

    @Autowired
    MyStringGateway myStringGateway;

    @Test
    void test() {
        myStringGateway.send("hello");
        myStringGateway.send("integration");
        myStringGateway.send("hello world");
    }
}
```

输出到 output.txt 文件

```
HELLO
INTEGRATION
HELLO WORLD
```



### sftp

一个自动从远程 sftp 拉取文件的示例

依赖

```
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-integration'
    implementation 'org.springframework.integration:spring-integration-sftp'
}
```

定义 session factory 。生存环境建议用密钥，而不是密码，且关闭 allow unknown keys

```java
@Bean
public SessionFactory<SftpClient.DirEntry> sftpSessionFactory() {
    DefaultSftpSessionFactory factory = new DefaultSftpSessionFactory();
    factory.setHost(host);
    factory.setPort(port);
    factory.setUser(user);
    factory.setPassword(password);
    factory.setAllowUnknownKeys(true);
    return factory;
}
```

FileWritingMessageHandler 负责写文件，即使没有手动创建，也有自动配置的

```java
@Bean
public SftpInboundFileSynchronizer sftpInboundFileSynchronizer() {
    SftpInboundFileSynchronizer synchronizer = new SftpInboundFileSynchronizer(sftpSessionFactory());
    synchronizer.setDeleteRemoteFiles(false);
    synchronizer.setRemoteDirectory(sftpRemoteDirectory);
    synchronizer.setFilter(new SftpSimplePatternFileListFilter("*.txt"));
    synchronizer.setDeleteRemoteFiles(true);
    return synchronizer;

}

@Bean
public SftpInboundFileSynchronizingMessageSource sftpMessageSource() {
    SftpInboundFileSynchronizingMessageSource source = new SftpInboundFileSynchronizingMessageSource(sftpInboundFileSynchronizer());
    source.setLocalDirectory(new File(sftpLocalDirectory));
    source.setAutoCreateLocalDirectory(true);
    source.setMaxFetchSize(10); 

    return source;
}

@Bean
public MessageHandler fileWritingMessageHandler() {
    FileWritingMessageHandler handler = new FileWritingMessageHandler(new File(sftpLocalDirectory));
    handler.setAutoCreateDirectory(true);
    handler.setExpectReply(false);
    return handler;
}

@Bean
public IntegrationFlow sftpInboundFlow() {

    return IntegrationFlow
            .from(sftpMessageSource(), e -> e.poller(Pollers.fixedDelay(Duration.ofSeconds(7)).maxMessagesPerPoll(2)))
            .handle(message -> {
                System.out.println("Fetched file: " + message.getPayload());
            })
            .get();
}
```