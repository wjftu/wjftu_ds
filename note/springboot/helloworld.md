---
title: HelloWorld
sidebar_position: 2
---

### HelloWorld

新建一个 web 项目的 HelloWorld

引入 maven 依赖， pom 文件如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.wjftu</groupId>
    <artifactId>springbootdemo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springbootdemo</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>8</java.version>
    </properties>
    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

    </dependencies>

    <!-- 用于打包的 maven 插件 -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

启动类

```java
package demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//告诉编译器这是个 Spring Boot 应用
@SpringBootApplication
public class SpringBootDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootDemoApplication.class, args);
    }
}
```

在启动类所在的包或子包下建一个 Controller 类

```java
package demo.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Rest 风格的 controller 
@RestController
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping("/springboot")
    public String hello(){
        return "hello spring boot";
    }

}
```

运行启动类的 main 方法，访问 localhost:8080/hello/springboot ，显示 `hello spring boot`

并没有配置 tomcat 等 web 服务器（使用了内嵌的 tomcat 服务器），也没有对应用进行配置，直接就成功搭建了一个简单的 web 服务！

### 好用的工具

1. lombok

可以方便的省去很多模版代码

在 Intellij 中安装 lombok 插件并添加依赖

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

常用方法：

* @data 自动生成 getter setter toString equals hashCode 方法  
* @Getter/Setter 自动生成 getter setter 方法  
* @ToString 自动生成 toString 方法  
* @EqualsAndHashcode 自动根据字段重写 equals 和 hashcode 方法  
* @NoArgsConstructor/AllArgsConstructor 自动生成无参、全参构造函数  

2. devtools

按 ctrl+F9 或 command+F9 可以更新并启动项目

如果需要真正的改变代码自动更新，只有用付费的 JRebel .

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```