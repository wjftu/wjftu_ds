---
title: Spring Boot
sidebar_position: 1
---

### 什么是 Spring Boot

Spring 框架有 IOC 和 AOP 特性，被广泛使用，但也有配置繁琐的缺点。 Spring Boot 在 Spring 的基础上开发，简化搭建和开发过程，不需要大量样板化配置。Spring Boot 可以帮助你创建单体的、生产级的、基于 spring 的应用。Spring Cloud 在 Spring Boot 基础上诞生，Spring Boot 与云计算天然集成。

官方文档：

* [https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
* [https://docs.spring.io/spring-boot/docs/current/reference/](https://docs.spring.io/spring-boot/docs/current/reference/)

优点：

* 单体应用，内嵌 web 服务器，可以直接使用 `java -jar` 运行，便于部署
* 基于 Spring ，用 Spring 管理组件
* 自动对 starter 进行自动配置和依赖管理
* 不生成代码，可以不用 xml 配置文件，代码易于阅读和维护
* 与云计算天然集成

版本：

这里可以看到 Spring Boot 的版本：  
https://spring.io/projects/spring-boot#learn

CURRENT 是最新稳定版。GA 是发布版本，是稳定版本。 SNAPSHOT 是快照版本，可能会更改。

系统要求：

* 2.x 版本要求 Java 8 以上，目前兼容至 Java 17
* 2.x 版本要求 Maven 3.5+ 或 Gradel 6.8.x +



### 新建项目

有多种方式可以创建 Spring Boot 项目，可以是普通的 Maven 或 Gradle 项目，也可以用 spring-boot-cli，Spring Tool Suite 等工具创建。

可以很方便地使用在线的 Spring Initializr 创建项目 https://start.spring.io/ ，输入项目信息，选择项目类型和 JDK 版本，选择 starter 组件，即可在线生成项目。

