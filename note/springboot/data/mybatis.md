---
title: MyBatis
sidebar_position: 3
---

MyBatis-Spring-Boot-Starter 帮助我们在 Spring Boot 项目中即成 MyBatis

参考文档： https://mybatis.org/spring-boot-starter

由于 MyBatis 不是 Spring Boot 版本管理的模块，需要手动指定版本

版本对应关系

|MyBatis-Spring-Boot-Starter|MyBatis-Spring|Spring Boot|Java|
|-|-|-|-|
|3.0|3.0|3.0 - 3.1|17 or higher|
|2.3|2.1|2.5 - 2.7|8 or higher|

pom 文件导入 mybatis 依赖和数据库驱动

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.1</version>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

实体类
```java
@Data
public class City {
    private Integer id;

    private String name;

    private String countrycode;

    private String district;

    private String info;
}
```

Mapper 接口

```java
@Mapper
public interface CityMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(City row);

    int insertSelective(City row);

    City selectByPrimaryKey(Integer id);

    //...
}
```

mapper.xml 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="mybatisgenerator.mapper.CityMapper">
  <resultMap id="BaseResultMap" type="mybatisgenerator.entity.City">
    <id column="ID" jdbcType="INTEGER" property="id" />
    <result column="Name" jdbcType="CHAR" property="name" />
    <result column="CountryCode" jdbcType="CHAR" property="countrycode" />
    <result column="District" jdbcType="CHAR" property="district" />
  </resultMap>
  <resultMap extends="BaseResultMap" id="ResultMapWithBLOBs" type="mybatisgenerator.entity.City">
    <result column="Info" jdbcType="LONGVARCHAR" property="info" />
  </resultMap>
  <sql id="Base_Column_List">
    ID, Name, CountryCode, District
  </sql>
  <sql id="Blob_Column_List">
    Info
  </sql>
  <select id="selectByPrimaryKey" parameterType="java.lang.Integer" resultMap="ResultMapWithBLOBs">
    select 
    <include refid="Base_Column_List" />
    ,
    <include refid="Blob_Column_List" />
    from city
    where ID = #{id,jdbcType=INTEGER}
  </select>
  <delete id="deleteByPrimaryKey" parameterType="java.lang.Integer">
    delete from city
    where ID = #{id,jdbcType=INTEGER}
  </delete>
  <insert id="insert" parameterType="mybatisgenerator.entity.City">
    insert into city (ID, Name, CountryCode, 
      District, Info)
    values (#{id,jdbcType=INTEGER}, #{name,jdbcType=CHAR}, #{countrycode,jdbcType=CHAR}, 
      #{district,jdbcType=CHAR}, #{info,jdbcType=LONGVARCHAR})
  </insert>
</mapper>
```