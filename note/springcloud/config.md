# Config

文档：  
https://docs.spring.io/spring-cloud-config/docs/current/reference/html/

Spring Cloud Config 提供了配置管理，将配置抽象到服务接口中，集中管理配置，可以对配置进行版本管理

其它类似产品：  
* Eureka 通常用作服务发现，也可以管理键值配置  
* Consul 广泛使用的 Go 语言开发的配置中心  
* Nacos 国内用的比较多，Spring Cloud Alibaba 组件

下面示例以 jubilee 为例

### 服务端搭建

引入依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-config-server</artifactId>
</dependency>
```

启动类加上注解 `@EnableConfigServer` 

Spring Cloud Config 支持以多种方式管理配置文件，包括文件，git，svn，s3 等等

文件系统的配置，需要设置 `spring.profiles.active=native` ，然后在 search-locations 中配置配置文件路径

```yml
spring:
  application:
    name: config-server
  profiles:
    active: native
  cloud:
    config:
      server:
        native:
          search-locations:
            - classpath:/config
server:
  port: 8888
```

例如这个路径下有 consumer.yml 文件

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useUnicode=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: user1
    password: 123456
```

以及一个 dev 环境的配置 consumer-dev.yml

```yml
spring:
  datasource:
    password: 1234567777
```

通过 http 请求获取配置的方式：

```
/{application}/{profile}[/{label}]
/{application}-{profile}.yml
/{application}-{profile}.properties
/{label}/{application}-{profile}.yml
/{label}/{application}-{profile}.properties
```

profile 通常用于表示环境信息，可以用逗号分隔配置多个。label 通常是 git 分支，用于版本管理，默认 master


启动服务，访问 http://localhost:8888/consumer/default 得到

```json
{
  "name": "consumer",
  "profiles": [
    "default"
  ],
  "label": null,
  "version": null,
  "state": null,
  "propertySources": [
    {
      "name": "classpath:/config/consumer.yml",
      "source": {
        "spring.datasource.url": "jdbc:mysql://localhost:3306/test?useUnicode=true",
        "spring.datasource.driver-class-name": "com.mysql.cj.jdbc.Driver",
        "spring.datasource.username": "user1",
        "spring.datasource.password": 123456
      }
    }
  ]
}
```

访问 http://localhost:8888/consumer/dev 得到

```json
{
  "name": "consumer",
  "profiles": [
    "dev"
  ],
  "label": null,
  "version": null,
  "state": null,
  "propertySources": [
    {
      "name": "classpath:/config/consumer-dev.yml",
      "source": {
        "spring.datasource.password": 1234567777
      }
    },
    {
      "name": "classpath:/config/consumer.yml",
      "source": {
        "spring.datasource.url": "jdbc:mysql://localhost:3306/test?useUnicode=true",
        "spring.datasource.driver-class-name": "com.mysql.cj.jdbc.Driver",
        "spring.datasource.username": "user1",
        "spring.datasource.password": 123456
      }
    }
  ]
}
```

Spring 解析属性时，先找到默认属性，如果有特定环境的属性，会覆盖默认属性，例如读取 dev 环境配置的属性，会覆盖默认的。

git 配置示例

可以配置本地仓库，也可以配置远程仓库

```yml
spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: /path/to/repository
```

在 /path/to/repository 下有 consumer.yml 文件，有 master 和 labelA 两个 branch

访问 http://localhost:8888/consumer/default/ 得到 master 的配置

```json
{
  "name": "consumer",
  "profiles": [
    "default"
  ],
  "label": null,
  "version": "ebe3d114d8c0ccec95d754f5a4f7d86e6b7b60ee",
  "state": null,
  "propertySources": [
    {
      "name": "/Users/mac/Documents/tmp/g/consumer.yml",
      "source": {
        "spring.datasource.url": "jdbc:mysql://localhost:3306/test?useUnicode=true",
        "spring.datasource.driver-class-name": "com.mysql.cj.jdbc.Driver",
        "spring.datasource.username": "user1",
        "spring.datasource.password": 12345677
      }
    }
  ]
}
```

访问 http://localhost:8888/consumer/default/labelA 得到 labelA 分支的配置

```json
{
  "name": "consumer",
  "profiles": [
    "default"
  ],
  "label": "labelA",
  "version": "53986b32c389a5e7ac5f330f5315a25f4a115faa",
  "state": null,
  "propertySources": [
    {
      "name": "/Users/mac/Documents/tmp/g/consumer.yml",
      "source": {
        "spring.datasource.url": "jdbc:mysql://localhost:3306/test?useUnicode=true",
        "spring.datasource.driver-class-name": "com.mysql.cj.jdbc.Driver",
        "spring.datasource.username": "user1",
        "spring.datasource.password": 123456,
        "myLabel": "AAA"
      }
    }
  ]
}
```

