# Gateway

路由网关

早期还有一个产品 zuul，已经停止更新，现在改用 spring 官方开发的 Gateway 。提供统一入口，路由的功能

官方文档：  
https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/

基于 WebFlux ，所以 Spring Data 和 Spring Security 无法使用

Maven 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

简单的配置，让多个后端服务可以有统一的入口

predicates 配置陆游规则，Path 为根据路径匹配  
uri 配置路由的地址，lb 表示使用负载均衡

```yml
spring:
  application:
    name: gateway
  cloud:
    gateway:
      routes:
        - id: consumer-server   
          uri: lb://consumer-server  
          predicates: 
            - Path=/consumer/**  
        - id: producer-server   
          uri: lb://producer-server  
          predicates: 
            - Path=/producer/**  
```