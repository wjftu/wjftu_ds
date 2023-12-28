# Eureka

Spring Cloud Netflix Eureka 是一个开源的服务注册中心，用作服务治理（服务注册与发现）

最新版文档：  
https://docs.spring.io/spring-cloud-netflix/docs/current/reference/html/

### Eureka 服务端

引入 Maven 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

启动类加上

```java
@EnableEurekaServer
@SpringBootApplication
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

配置

* eureka.client.fetch-registry  是否从服务器拉取信息
* eureka.client.register-with-eureka  是否注册到 eureka
* eureka.client.service-url.defaultZone  服务注册地址

**单实例配置：**

```yml
server:
  port: 8761
spring:
  application:
    name: eureka-server
eureka:
  client:
    fetch-registry: false
    register-with-eureka: false
```

启动后访问 http://localhost:8761 即可看到 eureka 页面

**双实例配置：**

peer1:

```yml
server:
  port: 8761
spring:
  application:
    name: eureka-server
eureka:
  instance:
    hostname: eureka-server-peer1
  client:
    fetch-registry: false
    register-with-eureka: true
    service-url:
      defaultZone: http://localhost:8762/eureka
```

peer2

```yml
server:
  port: 8762
spring:
  application:
    name: eureka-server
eureka:
  instance:
    hostname: eureka-server-peer2
  client:
    fetch-registry: false
    register-with-eureka: true
    service-url:
      defaultZone: http://localhost:8761/eureka
```

这样的配置下两个实例会互相注册到对方，可以在管理页面上看到


### 客户端

引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

配置：

spring.application.name 作为服务名注册到 eureka ，如果没有配置则显示 UNKNOW   

```
spring:
  application:
    name: producer-server
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

启动，服务将注册到 eureka server

打印日志：
```
Registering application PRODUCER-SERVER with eureka with status UP
```