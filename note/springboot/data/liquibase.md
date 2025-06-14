---
title: Liquibase
sidebar_position: 11
---


Liquibase 是一个开源的数据库变更管理工具，它帮助开发团队跟踪、版本控制和部署数据库 schema 的变化。支持多种数据库，记录变更历史。

### 快速上手

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

liquibase 支持多种 change type

例如：

```xml
<!-- 1. Create a table -->
<changeSet id="1" author="jeff">
    <createTable tableName="users">
        <column name="id" type="BIGINT">
            <constraints primaryKey="true" nullable="false"/>
        </column>
        <column name="username" type="VARCHAR(50)">
            <constraints unique="true" nullable="false"/>
        </column>
        <column name="email" type="VARCHAR(100)"/>
        <column name="phone" type="VARCHAR(100)"/>
    </createTable>
</changeSet>

<!-- 2. Add column -->
<changeSet id="2" author="jeff">
    <addColumn tableName="users">
        <column name="created_at" type="TIMESTAMP" defaultValueComputed="CURRENT_TIMESTAMP"/>
    </addColumn>
</changeSet>

<!-- 3. Insert data -->
<changeSet id="3" author="jeff">
    <insert tableName="users">
        <column name="id" valueNumeric="1"/>
        <column name="username" value="admin"/>
        <column name="email" value="admin@example.com"/>
        <column name="phone" value="123"/>
    </insert>
    <insert tableName="users">
        <column name="id" valueNumeric="2"/>
        <column name="username" value="user"/>
        <column name="phone" value="234"/>
    </insert>
</changeSet>

<!-- 4. Update data -->
<changeSet id="4" author="jeff">
    <update tableName="users">
        <column name="email" value="updated@example.com"/>
        <where>username = 'admin'</where>
    </update>
</changeSet>

<!-- 5. Delete data -->
<changeSet id="5" author="jeff">
    <delete tableName="users">
        <where>username = 'user'</where>
    </delete>
</changeSet>

<!-- 6. Add NOT NULL constraint -->
<changeSet id="6" author="jeff">
    <addNotNullConstraint tableName="users"
                          columnName="username"
                          columnDataType="VARCHAR(50)"/>
</changeSet>

<!-- 7. Drop a column -->
<changeSet id="7" author="jeff">
    <dropColumn tableName="users" columnName="email"/>
</changeSet>

<!-- 8. Rename a column -->
<changeSet id="8" author="jeff">
    <renameColumn tableName="users"
                  oldColumnName="username"
                  newColumnName="login_name"
                  columnDataType="VARCHAR(50)"/>
</changeSet>

<!-- 9. Create index -->
<changeSet id="9" author="jeff">
    <createIndex indexName="idx_phone" tableName="users" unique="true">
        <column name="phone"/>
    </createIndex>
</changeSet>

<!-- 10. Drop index -->
<changeSet id="10" author="you">
    <dropIndex indexName="idx_phone" tableName="users"/>
</changeSet>

<!-- 11. Execute raw SQL -->
<changeSet id="11" author="jeff">
    <sql>
        ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    </sql>
</changeSet>

<!-- 12. Modify Column Data Type -->
<changeSet id="12" author="you">
    <modifyDataType tableName="users" columnName="phone" newDataType="VARCHAR(10)"/>
</changeSet>
```

### Liquibase gradle plugin

Liquibase gradle plugin 可以用 Gradle 来管理数据库变更

https://github.com/Logicify/liquibase-gradle-plugin

当前最新版本 3.0.2 ，但可能问题较多，这里使用 2.2.0 版本

添加插件，配置 liquibaseRuntime
```
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.10'
    id 'io.spring.dependency-management' version '1.1.7'
    id 'org.liquibase.gradle' version '2.2.0'
}

dependencies {
    liquibaseRuntime 'org.liquibase:liquibase-core'  
    liquibaseRuntime 'org.postgresql:postgresql'            
    liquibaseRuntime 'info.picocli:picocli:4.6.1'
}

liquibase {
    activities {
        main {
            changelogFile 'src/main/resources/db/changelog/db.changelog-master.xml'
            url 'jdbc:postgresql://ip:port/dbname?sslmode=require'
            username 'username'
            password 'password'
            driver 'org.postgresql.Driver'
        }
        runList = 'main'
    }
}

```

用法：

```
# 更新
gradle update

# 回滚 1 个 changeset
gradle rollbackCount -PliquibaseCommandValue=1

# 回滚到 tag
gradle rollback -PrunList='dev' -PliquibaseCommandValue=v1.0
```

多环境配置

```
liquibase {
    activities {
        main {
            changelogFile 'src/main/resources/db/changelog/db.changelog-master.xml'
            url 'jdbc:postgresql://ip:port/dbname?sslmode=require'
            username 'username'
            password 'password'
            driver 'org.postgresql.Driver'
        }
        dev {
            changelogFile 'src/main/resources/db/changelog/db.changelog-master.xml'
            url 'jdbc:postgresql://ip:port/devdb?sslmode=require'
            username 'username'
            password 'password'
            driver 'org.postgresql.Driver'
        }
        runList = project.ext.runList
    }
}
```

部署时传入具体的环境

```
gradle update -PrunList='dev'
```


