# AWS S3

对象存储是一种文件存储解决方案，简单易用，高性能，高可靠，兼容性好，成本低，可扩展。AWS 的 S3 对象存储是业界标准，其他很多云服务商的对象存储产品有 s3 兼容模式，如 qiniu ， oracle cloud 。

对象存储和 NAS 的区别： 

对象存储无需挂载，只需要网络能通就能使用。NAS 是文件系统，生产上会有各种问题，如 inodes 使用率高报警，遇到文件权限问题（两个应用一个是 root 一个非 root）。生产上体验上对象存储相对于 NAS 慢一些，但 NAS 偶尔会有一笔非常慢的读取或写入，而且高并发下更容易发生。


### S3 Java SDk

可以通过 sdk 与 s3 进行交互，当前版本是 2.x 版本，和 1.x 版本差别很大。新版 sdk 大量使用建造者模式，代码更美观。

sdk 文档：  
https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/home.html

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.23.7</version>
</dependency>
```

创建客户端

有多种方式设置 credential ，例如用 Java 系统变量，环境变量，配置文件

Access Key 可以理解为用户名，Secret Key 可以理解为密码，Endpoint 可以理解为请求端点。在使用非 AWS 服务或者 on-premise 服务的情况下，需要自己设置端点，但仍然要设置一个假的 region 。

官方文档提到 Reuse an SDK client, if possible ，客户端是线程安全的类，所以在 Spring 开发时，可以创建为一个 bean

```java
@Configuration
public class S3Config {

    @Value("${accessKey}")
    String accessKey;

    @Value("${secretKey}")
    String secretKey;

    @Value("${endpoint}")
    String endpoint;

    @Bean
    public S3Client s3Client() {
        System.setProperty("aws.accessKeyId", accessKey);
        System.setProperty("aws.region", "us-east-1");
        System.setProperty("aws.secretAccessKey", secretKey);

        S3Client s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .build();
        return s3;
    }
}
```

客户端设置超时时间，apiCallTimeout 为单个请求超时时间，apiCallAttemptTimeout 为包括重试在内的整个过程的超时时间。

```java
S3Client s3 = S3Client.builder()
        .overrideConfiguration(b -> 
                b.apiCallTimeout(Duration.ofSeconds(3))
                        .apiCallAttemptTimeout(Duration.ofSeconds(10)))
        .build();
```

上传对象

```java
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key("1.txt")
                .build();
        RequestBody requestBody = RequestBody.fromByteBuffer(ByteBuffer.wrap(new byte[0]));
                
        PutObjectResponse response = s3Client.putObject(request, requestBody);
```

RequestBody 有多种方式创建，可以从 ByteBuffer ，字节数组，文件，流，文件内容创建。

```java
RequestBody requestBody = RequestBody.fromByteBuffer(ByteBuffer.wrap(new byte[0]));
RequestBody requestBody2 = RequestBody.fromBytes(new byte[0]);
RequestBody requestBody3 = RequestBody.fromFile(new File("1.txt"));
try (InputStream is = new FileInputStream("1.txt")) {
    RequestBody requestBody4 = RequestBody.fromInputStream(is, is.available());
} catch (IOException e) {
    throw new RuntimeException(e);
}
RequestBody requestBody5 = RequestBody.fromString("abc", StandardCharsets.UTF_8);
```

列出对象

prefix 指定前缀，maxkey 指定列出对象最大数量（在数量很多时不设置会超时）

```java
ListObjectsRequest request = ListObjectsRequest.builder()
        .bucket(bucketName)
        .prefix("1")
        .maxKeys(2)
        .build();
ListObjectsResponse response = s3Client.listObjects(request);
List<S3Object> contents = response.contents();
for(S3Object s3Object : contents) {
    System.out.println(s3Object.key());
}
```