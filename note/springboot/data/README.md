---
title: 使用数据
sidebar_label: 使用数据
---

# 使用数据

Java 使用 JDBC 来访问数据库，但直接使用 JDBC 访问是十分复杂的，需要创建连接、创建语句、执行语句、处理结果、关闭连接、处理异常。Spring Boot 提供了便捷的数据访问方式，省去写一大堆复杂的模版代码。




### h2databases

为了便于学习，如果学习的环境没有 MySql 等数据库，可以使用 Spring Boot 官方推荐的 h2databases 等嵌入式内存数据库。

pom 文件中引入依赖

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

使用 application.yml 进行配置

```yml
spring:
  datasource:
    url: jdbc:h2:mem:test
#    url: jdbc:h2:~/test
    driver-class-name: org.h2.Driver
    username: sa
    password: sa

    schema: classpath:db/schema.sql
    data: classpath:db/data.sql

  h2:
    console:
      path: /h2-console
      enabled: true
```

`spring.datasource.url` 配置 url ，可以是内存或者硬盘。
`spring.datasource.driver-class-name` 配置驱动 
`spring.datasource.schema` 配置初始表结构
`spring.datasource.data` 配置初始数据
`spring.h2.console.path` 设置控制台路径，完整路径为 `localhost:port/path`
`spring.h2.console.enabled` 启用控制台

### 数据库驱动

访问数据库时，还需要根据所用数据库类型，引入相应的依赖

如 MySql 的

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

虽然依赖的版本可以自动配置，但还是可以根据实际情况手动指定版本。可以直接在引入 mysql-connector-java 时指定版本，也可以在 propertities 中指定。