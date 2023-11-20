---
title: Maven
sidebar_position: 20
---

# Maven 

Maven 是一个常用的项目管理工具，常用于依赖管理和构建项目。

一个简单的项目通常依赖几十上百个 jar 包，手动导入会很辛苦，通过 Maven 我们可以容易的导入和管理依赖。一个项目通常有成百上千的源代码和配置文件，手动编译和打包很困难，通过 Maven 可以更加容易的编译和打包。

### 下载和安装

下载地址： https://maven.apache.org/download.cgi

下载 binary ，解压即可使用。当前 Maven 最新为 3.9 版本，需要 java 8 以上运行环境

配置环境变量和 path

```shell
export MVN_HOME=/opt/apache-maven-3.9.2
export PATH=${PATH}:${MVN_HOME}/bin
```

配置 `MVN_HOME` 环境变量

测试 

```
% mvn -v
Apache Maven 3.9.2 (c9616018c7a021c1c39be70fb2843d6f5f9b8a1c)
Maven home: /opt/apache-maven-3.9.2
Java version: 17.0.7, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
Default locale: en_CN, platform encoding: UTF-8
OS name: "mac os x", version: "13.3.1", arch: "x86_64", family: "mac"
```

bin 目录下放置启动脚本，boot 目录下的 plexus-classworlds-2.6.0.jar 是 maven 的类加载器， conf 目录放置配置文件， settings.xml 是主要的配置文件


mirrors 配置镜像，国内使用可以把中央仓库配置为国内镜像

```xml
<mirrors>
    <mirror>
      <id>nexus-tencentyun</id>
      <mirrorOf>central</mirrorOf>
      <name>Nexus tencentyun</name>
      <url>http://mirrors.cloud.tencent.com/nexus/repository/maven-public/</url>
    </mirror> 
</mirrors>
```

localRepository 用于配置本地仓库路径，默认路径为用户路径下的 .m2 文件夹

```xml
<!-- Default: ${user.home}/.m2/repository -->
<localRepository>/path/to/local/repo</localRepository>
```

### 仓库和坐标

Maven 仓库是用来存放 jar 包。本地仓库是自己电脑上的仓库。远程仓库可以为本地仓库提供资源，包括中央仓库和私服。中央仓库由 Maven 团队维护，存储几乎所有资源。私服可以在部门或公司内部范围内存储资源，可以存放不对外开放的资源，可以从中央仓库获取资源并缓存。

中央仓库 https://mvnrepository.com/ ，可以搜索依赖

Maven 坐标

groupId：公司或组织的 id，即公司或组织域名的倒序
artifactId：一个项目或者是项目中的一个模块的 id，作为 Maven 工程的工程名
version：版本号


### pom 文件

pom 的意思是 Project Object Model 的缩写，pom 文件配置参考文档 https://maven.apache.org/pom.html

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.wjftu</groupId>
    <artifactId>hello</artifactId> 
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
    </dependencies>

</project>
```

跟标签 project ，表示对当前项目进行配置

modelVersion 配置模型版本，当前版本为 4.0.0 ，从 Maven 2 开始就是 4.0.0

properties 用于配置属性，例如：

```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding> 
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
</properties>
```

groupId artifactId version 配置当前项目坐标，简称 GAV

packaging 用来配置打包方式，默认 jar ，生成 jar 包，也可以为 war ，打 war 包，是 web 工程，也可以是 pom ，表示此工程是用来管理其它工程的父工程



dependencies 配置依赖。

依赖可以传递，例如 A 依赖 B， B 依赖 C，那么 A 项目可以使用 C 。依赖冲突时，通过路径优先和声明优先的方式解决冲突。路径优先：层级浅的优先，例如 A 依赖 B ，B 依赖于 C 的 1.0.0 版本，同时 A 依赖 D ，D 依赖 E ，E 依赖 C 的 1.0.1 版本，那么由于 A 到 B 到 C 的层级浅，A 使用的是 1.0.0 版本的 C 。声明优先：后声明的会覆盖先声明的，例如 A 依赖了 2 个版本的 B ，后面的版本会生效。

每个依赖可以用 scope 配置范围。compile （默认）在主程序和测试程序范围有效，且参与打包。test 在测试程序范围有效，不参与打包。provided 在主代码和测试代码范围有效，不参与打包。runtume 只参与打包。


### 生命周期

参考文档 https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html

Maven 3 大生命周期 Clean Default Site。生命周期又包含多个 Phase

Clean 用于清理，Site 用于项目站点文档创建（不常用），其余的为 Default ，主要构建过程，包括 compile package test install 等。

生命周期是通过 plugin 实现的，

常用的打 jar 和 war 包的 default 的生命周期和对应的插件为：

|Phase|Plugin|
|-|-|
|process-resources|resources:resources|
|compile|compiler:compile|
|process-test-resources|resources:testResources|
|test-compile|compiler:testCompile|
|test|surefire:test|
|package|jar:jar|
|install|install:install|
|deploy|deploy:deploy|

process-resources 复制并处理资源文件  
compile 编译 main 路径下的代码  
process-test-resources 复制并处理测试资源文件  
test-compile 编译 test 路径下的代码  
test 测试  
package 打包
install 安装到本地仓库  
deploy 部署到远程仓库

执行每一个 Phase 的时候，也会执行它前面的步骤


### 命令

```
# 编译
mvn compile 
# 清理 
mvn clean
# 测试
mvn test
# 打包
mvn package
# 安装到本地仓库
mvn install
```

Maven 项目目录结构：

```
|-- pom.xml(核心配置文件)
|-- src
|-- main
    |-- java(java源代码目录)
    |-- resources(资源文件目录)
|-- test
    |-- java(测试代码目录)
|-- target(输出目录)
    |-- classes(编译后的class文件存放处)
```

src/main/java 代码
src/main/resources 配置文件
src/test/java 测试代码
src/test/resources 测试配置文件
target/ 编译后的文件
pom.xml 核心配置文件

创建 Maven 工程时可以手工创建，也可以用 plugin 创建

```
mvn archetype:generate -DgroupId=com.wjftu -DartifactId=hello -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

一个最基本的 maven 项目示例：

代码文件 src/main/java/com/wjftu/Hello.java

```java
package com.wjftu;

public class Hello{
    public String sayHello(String s) {
        return "Hello " + s;
    }
}
```

测试类文件 src/test/java/com/wjftu/HelloTest.java
```java
package com.wjftu; 

import org.junit.Test; 
import org.junit.Assert;

public class HelloTest{
    @Test
    public void testSayHello(){
        Hello hello = new Hello();
        String ret = hello.sayHello("maven");
        Assert.assertEquals("Hello maven", ret);
    }
}
```

pom 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.wjftu</groupId>
    <artifactId>hello</artifactId> 
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
    </dependencies>

</project>
```

打包

```
# mvn package
[INFO] Scanning for projects...
[INFO] 
[INFO] --------------------------< com.wjftu:hello >---------------------------
[INFO] Building hello 1.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- resources:3.3.0:resources (default-resources) @ hello ---
[WARNING] Using platform encoding (UTF-8 actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] Copying 0 resource
[INFO] 
[INFO] --- compiler:3.10.1:compile (default-compile) @ hello ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- resources:3.3.0:testResources (default-testResources) @ hello ---
[WARNING] Using platform encoding (UTF-8 actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] Copying 0 resource
[INFO] 
[INFO] --- compiler:3.10.1:testCompile (default-testCompile) @ hello ---
[INFO] Changes detected - recompiling the module!
[WARNING] File encoding has not been set, using platform encoding UTF-8, i.e. build is platform dependent!
[INFO] Compiling 1 source file to /Users/wjf/wjf/temp/mvntest/target/test-classes
[INFO] 
[INFO] --- surefire:3.0.0-M8:test (default-test) @ hello ---
# 省略很多下载过程
Downloaded from nexus-tencentyun: http://mirrors.cloud.tencent.com/nexus/repository/maven-public/org/apache/maven/surefire/common-java5/3.0.0-M8/common-java5-3.0.0-M8.jar (18 kB at 8.3 kB/s)
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.wjftu.HelloTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.024 s - in com.wjftu.HelloTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] 
[INFO] --- jar:3.3.0:jar (default-jar) @ hello ---
[INFO] Building jar: /Users/wjf/wjf/temp/mvntest/target/hello-1.0-SNAPSHOT.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  21.519 s
[INFO] Finished at: 2023-10-05T14:39:25+08:00
[INFO] ------------------------------------------------------------------------
```

在 target/classes/ 文件夹中有刚才编译的内容 class 文件，并在 target 目录下有一个 jar 包

打包前会编译代码、编译测试代码、测试


如果打包需要带上依赖，可以添加插件

```
<plugin>
    <artifactId>maven-assembly-plugin</artifactId>
    <configuration>
        <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
        </descriptorRefs>
    </configuration>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals>
                <goal>single</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```


### 父工程


父工程的 packaging 为 pom ，可用作依赖管理。pom 工程无需 src 文件夹，通常把子模块文件夹放到根目录下（非必需，子工程可以放到任何地方，并指定父工程位置）。

依赖的版本定义在 dependencyManagement 中

```xml
<dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-amqp</artifactId>
        <version>${activemq.version}</version>
      </dependency>
      <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-blueprint</artifactId>
        <version>${activemq.version}</version>
      </dependency>
      <dependency>
        <groupId>org.apache.activemq</groupId>
        <artifactId>activemq-broker</artifactId>
        <version>${activemq.version}</version>
      </dependency>
    </dependencies>
</dependencyManagement>
```

父工程可以包括多个子模块

```xml
<modules>
    <module>basic-helloworld</module>
    <module>data-jdbc</module>
    <module>data-mybatis</module>
    <module>a-module-for-test</module>
    <module>web-security</module>
    <module>web-security-backend</module>
    <module>data-mybatis-redis</module>
    <module>data-object-storage</module>
    <module>data-mybatis-generator</module>
    <module>data-mybatisgenerator</module>
</modules>
```

子模块通过 parent 指定父工程，子模块可以继承父工程的版本管理，引入依赖时无需定义版本号（ Spring Boot 的版本管理原理）。当子模块需要用自定义版本时，也可以在依赖中加入版本号，会覆盖父工程定义的。relativePath 可用来指定父工程 pom 文件位置。同样的，plugin 可以通过 pluginManagement 进行版本管理。

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.9</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

