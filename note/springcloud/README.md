# Spring Cloud

Spring Cloud 是一种基于 spring 的分布式解决方案

最新文档：  
https://spring.io/projects/spring-cloud/

历史版本文档：  
https://docs.spring.io/spring-cloud/docs/

例如 2021.0.9 AKA jubilee：  
https://docs.spring.io/spring-cloud/docs/2021.0.9/reference/html/


Spring Cloud 需要与 Spring Boot 版本匹配，版本兼容性可以在官方文档中看到，例如当前是：

|Release Train|Spring Boot Generation|
|-|-|
|2023.0.x aka Leyton|3.2.x|
|2022.0.x aka Kilburn|3.0.x, 3.1.x (Starting with 2022.0.3)|
|2021.0.x aka Jubilee|2.6.x, 2.7.x (Starting with 2021.0.3)|
|2020.0.x aka Ilford|2.4.x, 2.5.x (Starting with 2020.0.3)|
|Hoxton|2.2.x, 2.3.x (Starting with SR5)|
|Greenwich|2.1.x|
|Finchley|2.0.x|
|Edgware|1.5.x|
|Dalston|1.5.x|

例如 Spring Boot 2.7 应该使用 2021.0.x 版本，可以引入 spring-cloud-dependencies 进行版本管理

pom.xml

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.13</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>

<groupId>com.wjftu</groupId>
<artifactId>spring-cloud-jubilee-example</artifactId>
<version>1.0-SNAPSHOT</version>
<packaging>pom</packaging>

<properties>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <spring-cloud.version>2021.0.7</spring-cloud.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

常用组件：

* Eureka - 实现服务治理（服务注册与发现）
* Config - 配置中心，集中管理配置，可以对配置进行版本管理
* Feign - 为服务之间相互调用提供声明式负载均衡，基于 Ribbon
* Gateway - api网关，路由，负载均衡，统一入口
