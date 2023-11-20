---
title: Gradle
sidebar_position: 21
---

# Gradle

著名构建工具，比 Maven 更快，更适合大型项目，配置更简洁

下载地址： https://gradle.org/install/

解压并配置环境变量

```
export GRADLE_HOME=/opt/gradle/gradle-8.1.1
export PATH=$PATH:$GRADLE_HOME/bin
export GRADLE_USER_HOME=/path/to/maven/repository
```

```
$ gradle -v

Welcome to Gradle 8.1.1!
```

目录结构

/build 类似 maven 的 target 目录，编译打包的文件
/gradle/wraper 封装包装器文件夹
/src 源代码，同 maven ，例如 java 项目在 /src/main/java 下写源代码，如果是 war 包，还会有 /src/main/webapp 目录
gradlew 包装器启动脚本
gradlew.bat windows 包装器启动脚本
build.gradle 构建脚本，类似 maven 的 pom.xml
settings.gradle 配置文件，定义项目和子项目名称信息


使用 gradle init 创建项目

```
$ gradle init

Select type of project to generate:
  1: basic
  2: application
  3: library
  4: Gradle plugin
Enter selection (default: basic) [1..4] 2

Select implementation language:
  1: C++
  2: Groovy
  3: Java
  4: Kotlin
  5: Scala
  6: Swift
Enter selection (default: Java) [1..6] 3

Generate multiple subprojects for application? (default: no) [yes, no] 
Select build script DSL:
  1: Groovy
  2: Kotlin
Enter selection (default: Groovy) [1..2] 1

Select test framework:
  1: JUnit 4
  2: TestNG
  3: Spock
  4: JUnit Jupiter
Enter selection (default: JUnit Jupiter) [1..4] 

Project name (default: demo1): 
Source package (default: demo1): 
Enter target version of Java (min. 7) (default: 17): 
Generate build using new APIs and behavior (some features may change in the next minor release)? (default: no) [yes, no] no

> Task :init
Get more help with your project: https://docs.gradle.org/8.1.1/samples/sample_building_java_applications.html

BUILD SUCCESSFUL in 27s
2 actionable tasks: 2 executed
```

常见命令

```
gradle clean 清空 build 目录
gradle classes 编译业务代码和配置文件
gradle test 编译测试代码，生成测试报告
gradle build 构建项目
gradle build -x test 跳过测试构建
```