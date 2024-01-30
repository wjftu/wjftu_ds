---
title: Gradle
sidebar_position: 21
---

# Gradle

著名构建工具，比 Maven 更快，更适合大型项目，配置更简洁

下载地址： https://gradle.org/install/

解压并配置环境变量

```
export GRADLE_HOME=/opt/gradle/gradle-8.4
export PATH=$PATH:$GRADLE_HOME/bin
export GRADLE_USER_HOME=/path/to/maven/repository
```

```
% gradle -v

------------------------------------------------------------
Gradle 8.4
------------------------------------------------------------

Build time:   2023-10-04 20:52:13 UTC
Revision:     e9251e572c9bd1d01e503a0dfdf43aedaeecdc3f

Kotlin:       1.9.10
Groovy:       3.0.17
Ant:          Apache Ant(TM) version 1.10.13 compiled on January 4 2023
JVM:          17.0.7 (Oracle Corporation 17.0.7+8-LTS-224)
OS:           Mac OS X 13.3.1 x86_64

```

配置国内镜像

以腾讯镜像为例，编辑 init.d/init.gradle，寻找镜像会优先在本地 maven 仓库找，然后腾讯镜像，然后再到 maven 中央仓库

```
allprojects {
    repositories {
        mavenLocal()
        maven {
            url "https://mirrors.cloud.tencent.com/nexus/repository/maven-public/"
        }
        mavenCentral()
    }
}
```

如果是 kts 则这样配置

```
maven { url = uri("https://mirrors.cloud.tencent.com/nexus/repository/maven-public/") }
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
% gradle init
Starting a Gradle Daemon (subsequent builds will be faster)

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
  1: Kotlin
  2: Groovy
Enter selection (default: Kotlin) [1..2] 1

Select test framework:
  1: JUnit 4
  2: TestNG
  3: Spock
  4: JUnit Jupiter
Enter selection (default: JUnit Jupiter) [1..4] 

Project name (default: test): testproject
Source package (default: testproject): com.test
Enter target version of Java (min. 7) (default: 17): 
Generate build using new APIs and behavior (some features may change in the next minor release)? (default: no) [yes, no] no


> Task :init
To learn more about Gradle by exploring our Samples at https://docs.gradle.org/8.4/samples/sample_building_java_applications.html


```

会自动生成一个 gradle 项目，并带一个主程序 app/src/main/java/com/test/App.java

```java
package com.test;

public class App {
    public String getGreeting() {
        return "Hello World!";
    }

    public static void main(String[] args) {
        System.out.println(new App().getGreeting());
    }
}
```

将项目拖到 IntelliJ Idea 中运行，输出和 Maven 项目会有些不一样

```
20:22:19: Executing ':app:App.main()'...

> Task :app:compileJava
> Task :app:processResources NO-SOURCE
> Task :app:classes

> Task :app:App.main()
Hello World!

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.4/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD SUCCESSFUL in 4s
2 actionable tasks: 2 executed
20:22:24: Execution finished ':app:App.main()'.
```

Intellij Idea 在创建新项目时也可以选择 gradle 项目。也会自动生成 src 目录，gradle/wrapper 文件夹，build.gradle.kts 脚本， gradlew 和 gradlew.bat 包装器。

gradle-wrapper.properties 添加配置使用国内源，不然下载可执行文件非常非常慢

```
#distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.5-bin.zip
```

包装器第一次运行会下载可执行文件

```
% ./gradlew -v
Downloading https://services.gradle.org/distributions/gradle-8.4-bin.zip
............10%............20%.............30%............40%.............50%............60%.............70%............80%.............90%............100%

------------------------------------------------------------
Gradle 8.4
------------------------------------------------------------

Build time:   2023-10-04 20:52:13 UTC
Revision:     e9251e572c9bd1d01e503a0dfdf43aedaeecdc3f

Kotlin:       1.9.10
Groovy:       3.0.17
Ant:          Apache Ant(TM) version 1.10.13 compiled on January 4 2023
JVM:          17.0.7 (Oracle Corporation 17.0.7+8-LTS-224)
OS:           Mac OS X 13.3.1 x86_64

```

查看 Gradle 任务

```
% gradle task

> Task :tasks

------------------------------------------------------------
Tasks runnable from root project 'testproject'
------------------------------------------------------------

Application tasks
-----------------
run - Runs this project as a JVM application

Build tasks
-----------
assemble - Assembles the outputs of this project.
build - Assembles and tests this project.
buildDependents - Assembles and tests this project and all projects that depend on it.
buildNeeded - Assembles and tests this project and all projects it depends on.
classes - Assembles main classes.
clean - Deletes the build directory.
jar - Assembles a jar archive containing the classes of the 'main' feature.
testClasses - Assembles test classes.

Build Setup tasks
-----------------
init - Initializes a new Gradle build.
wrapper - Generates Gradle wrapper files.

Distribution tasks
------------------
assembleDist - Assembles the main distributions
distTar - Bundles the project as a distribution.
distZip - Bundles the project as a distribution.
installDist - Installs the project as a distribution as-is.

Documentation tasks
-------------------
javadoc - Generates Javadoc API documentation for the 'main' feature.

Help tasks
----------
buildEnvironment - Displays all buildscript dependencies declared in root project 'testproject'.
dependencies - Displays all dependencies declared in root project 'testproject'.
dependencyInsight - Displays the insight into a specific dependency in root project 'testproject'.
help - Displays a help message.
javaToolchains - Displays the detected java toolchains.
kotlinDslAccessorsReport - Prints the Kotlin code for accessing the currently available project extensions and conventions.
outgoingVariants - Displays the outgoing variants of root project 'testproject'.
projects - Displays the sub-projects of root project 'testproject'.
properties - Displays the properties of root project 'testproject'.
resolvableConfigurations - Displays the configurations that can be resolved in root project 'testproject'.
tasks - Displays the tasks runnable from root project 'testproject' (some of the displayed tasks may belong to subprojects).

Verification tasks
------------------
check - Runs all checks.
test - Runs the test suite.

To see all tasks and more detail, run gradle tasks --all

To see more detail about a task, run gradle help --task <task>

BUILD SUCCESSFUL in 16s
1 actionable task: 1 executed
```

常见命令

```
gradle clean 清空 build 目录
gradle classes 编译业务代码和配置文件，编译后的文件在 build 目录下
gradle test 编译测试代码，生成测试报告
gradle build 构建项目
gradle build -x test 跳过测试构建
```