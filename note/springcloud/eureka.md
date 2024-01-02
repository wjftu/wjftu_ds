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

通过 DiscoveryClient 获取实例信息

```java
@Autowired
DiscoveryClient discoveryClient;

@RequestMapping("/getInstance")
public List<ServiceInstance> getInstances() {
    List<ServiceInstance> list = discoveryClient.getInstances("PRODUCER-SERVER");
    return list;
}
```

结果如下：

```json
[{"uri":"http://172.20.10.9:8081","secure":false,"metadata":{"management.port":"8081"},"instanceId":"172.20.10.9:producer-server:8081","serviceId":"PRODUCER-SERVER","instanceInfo":{"instanceId":"172.20.10.9:producer-server:8081","app":"PRODUCER-SERVER","appGroupName":null,"ipAddr":"172.20.10.9","sid":"na","homePageUrl":"http://172.20.10.9:8081/","statusPageUrl":"http://172.20.10.9:8081/actuator/info","healthCheckUrl":"http://172.20.10.9:8081/actuator/health","secureHealthCheckUrl":null,"vipAddress":"producer-server","secureVipAddress":"producer-server","countryId":1,"dataCenterInfo":{"@class":"com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo","name":"MyOwn"},"hostName":"172.20.10.9","status":"UP","overriddenStatus":"UNKNOWN","leaseInfo":{"renewalIntervalInSecs":30,"durationInSecs":90,"registrationTimestamp":1704199881624,"lastRenewalTimestamp":1704199881624,"evictionTimestamp":0,"serviceUpTimestamp":1704199881119},"isCoordinatingDiscoveryServer":false,"metadata":{"management.port":"8081"},"lastUpdatedTimestamp":1704199881624,"lastDirtyTimestamp":1704199881058,"actionType":"ADDED","asgName":null},"scheme":"http","host":"172.20.10.9","port":8081}]
```


写一个提供方

```java
@RestController
public class ProducerService {

    @Value("${server.port}")
    int port;

    @RequestMapping("/producer")
    public String service() {
        return "producer of port " + port;
    }

}
```

再写一个调用方

```java
@RestController
public class ConsumerService {

    @Autowired
    RestTemplate restTemplate;

    @Value("${server.port}")
    int port;

    @RequestMapping("/consumer")
    public String service() {
        String url = "http://producer-server/producer";
        String response = restTemplate.getForObject(url, String.class);
        return "comsumer of port " + port + ", " + response;
    }
}
```

配置类中，restTemplate 加上 `@LoadBalanced` 注解，调用的时候无需指定 ip ，而是指定服务名。

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate(ClientHttpRequestFactory factory) {
    RestTemplate restTemplate = new RestTemplate(factory);
    return restTemplate;
}
```

启动两个提供方，注册到 eureka 。调用方调用提供方的服务，可以看到负载均衡

```
% curl http://localhost:9080/consumer
comsumer of port 9080 producer of port 8081        
% curl http://localhost:9080/consumer
comsumer of port 9080 producer of port 8082
```

