---
title: JDBC
sidebar_position: 1
---
首先引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
</dependency>
```

它间接依赖了 Hikari 数据库连接池， JDBC 和负责事物的 spring-tx 

```xml
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
    <version>4.0.3</version>
    <scope>compile</scope>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.3.16</version>
    <scope>compile</scope>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>5.3.16</version>
    <scope>compile</scope>
</dependency>
```

实体类实现 RowMapper 接口，重写 mapRow 方法，定义字段的映射关系

```java
import lombok.Data;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

@Data
public class User implements RowMapper<User> {
    Long id;
    String username;
    Integer age;

    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user=new User();
        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setAge(rs.getInt("age"));
        return user;
    }
}
```

在 repository 中注入 JdbcTemplate ，即可使用 JdbcTemplate 进行增删改查

```java
@Repository
public class UserRepository {
    
    JdbcTemplate jdbcTemplate;

    @Autowired
    public UserRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<User> findById(Long id){
        String sql = "select id, username, age from jdbc_user where id=?";
        List<User> list = jdbcTemplate.query(sql, new User(), new Object[]{id});
        return list;

    }

    public List<User> findAll(){
        String sql = "select id, username, age from jdbc_user limit 1000";
        List<User> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class));
        return list;
    }

    public int insert(String username, Integer age){
        String sql = "insert into jdbc_user(username, age) values(?,?)";
        int update = jdbcTemplate.update(sql, username, age);
        return update;
    }

    public int update(Long id, String username, Integer age){
        String sql = "update jdbc_user set username = ?, age = ? where id = ?";
        int update = jdbcTemplate.update(sql, username, age, id);
        return update;
    }

    public int delete(Long id){
        String sql = "delete from jdbc_user where id = ?";
        int update = jdbcTemplate.update(sql, id);
        return update;
    }
}
```


