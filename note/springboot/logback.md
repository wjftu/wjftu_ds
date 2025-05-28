---
title: LogBack
sidebar_position: 4
---

Spring Boot 3 默认使用 logback + slf4j 作为日志框架。每个 starter 会依赖 spring-boot-starter, spring-boot-starter 会依赖 spring-boot-starter-logging ，logging 依赖 ch.qos.logback:logback-classic 和 org.slf4j:slf4j-api 。无需手动引入 spring-boot-starter-logging ，通常会间接依赖，直接使用即可。

由于日志在启动时候就要用，因此不是通过 AutoConfiguration 配置的，而是通过 Listener 配置。配置类在 org.springframework.boot.autoconfigure.logging 包下

获取 Logger 和打印日志
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

Logger log = LoggerFactory.getLogger(this.getClass());
log.trace("trace log");
log.debug("debug log");
log.info("info log");
log.warn("warn log");
log.error("error log");
```

Logback 支持的 5 个日志级别 : TRACE DEBUG INFO WARN ERROR


配置日志级别。root 为所有日志，可以给具体的包指定具体日志级别。

```yml
logging:
  level:
    root: INFO
    path.to.package: DEBUG
```

默认日志输出在控制台。可以通过 logging.file.name 和 logging.file.path 配置日志文件输出位置。

如果 logging.file.name 指定文件名，将输出到当前位置。如果指定路径 + 文件名，则输出到绝对路径

如果 logging.file.path 指定路径，则会在路径下生成 spring.log 文件

如果两个都配置，则只有 logging.file.name 生效

```yml
logging:
  file:
    name: app.log
    path: /path/to/folder
```

可以在 application.yml 中配置很多内容，但更推荐使用 logback 配置文件。

有两种配置文件，对于 spring 应用，更推荐使用 logback-spring.xml：

logback.xml	由 Logback 直接加载（在 Spring Boot 启动之前），不依赖 Spring 环境。  
logback-spring.xml	由 Spring Boot 加载，在 Spring 上下文初始化之后，可以访问 Spring 环境变量。

logback-spring.xml 配置文件示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <springProperty name="logPath" source="logging.file.path" defaultValue="./"/>
    <springProperty name="logFileName" source="logging.file.name" defaultValue="myapp.log"/>

    <property name="LOG_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"/>
    <property name="LOG_FILE" value="${logFileName}" />
    <property name="LOG_PATH" value="${logPath}/${logFileName}" />

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <appender name="ROLLING_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_PATH}</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_PATH}-%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <append>true</append>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="ROLLING_FILE"/>
    </root>

</configuration>
```


