---
title: Liquibase
sidebar_position: 11
---


Liquibase 是一个开源的数据库变更管理工具，它帮助开发团队跟踪、版本控制和部署数据库 schema 的变化。支持多种数据库，记录变更历史。


创建一个 Spring Boot 项目，数据源用 h2 database ，引入 liquibase 依赖

build.gradle

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.10'
    id 'io.spring.dependency-management' version '1.1.7'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    runtimeOnly 'com.h2database:h2'
    implementation 'org.liquibase:liquibase-core'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}


```

配置 liquibase 和 h2

```yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: ''
  jpa:
    hibernate:
      ddl-auto: validate
  liquibase:
    change-log: classpath:db/changelog/changelog-master.xml
  h2:
    console:
      enabled: true
      path: /h2-console
```

创建一个 db/changelog/changelog-master.xml 文件，引入一个 changelog

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
      http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.1.xsd">

    <include file="db/changelog/changes/001-create-person-table.xml"/>

</databaseChangeLog>

```

change log 的内容是创建一个表

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
        xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
      http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.1.xsd">

    <changeSet id="1" author="yourname">
        <createTable tableName="person">
            <column name="id" type="BIGINT" autoIncrement="true">
                <constraints primaryKey="true" nullable="false"/>
            </column>
            <column name="name" type="VARCHAR(255)"/>
            <column name="age" type="INT"/>
        </createTable>
    </changeSet>

</databaseChangeLog>
```



成功创建一个 table

```
SHOW COLUMNS FROM PERSON;
FIELD  	TYPE  	NULL  	KEY  	DEFAULT  
ID	BIGINT	NO	PRI	NULL
NAME	CHARACTER VARYING(255)	YES		NULL
AGE	INTEGER	YES		NULL
```

创建一个新的 changelog file ， 002-add-email-column.xml ，给表添加一列，并把它加入 changelog-master.xml

```xml
<changeSet id="2" author="yourname">
    <addColumn tableName="person">
        <column name="email" type="VARCHAR(255)"/>
    </addColumn>
</changeSet>
```

新的表结构

```
FIELD  	TYPE  	NULL  	KEY  	DEFAULT  
ID	BIGINT	NO	PRI	NULL
NAME	CHARACTER VARYING(255)	YES		NULL
AGE	INTEGER	YES		NULL
EMAIL	CHARACTER VARYING(255)	YES		NULL
```

