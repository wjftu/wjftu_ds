---
title: Redis
sidebar_position: 10
---

添加 spring-boot-starter-data-redis 以及连接池依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
    <version>2.11.1</version>
</dependency>
```

测试可以使用 docker 运行单机模式 redis ，默认密码为空

```
docker run --name redis-test -p 6379:6379 redis
```

Spring Boot 中的 MySQL 和 Redis 配置

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useUnicode=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: user1
    password: 123456
  redis:
    database: 0
    host: localhost
    port: 6379
    timeout: 5000ms
    lettuce:
      pool-max-active: 8
      pool-max-wait: -1ms
      pool-max-idle: 4
      pool-min-idle: 0
```

可以使用 RedisTemplate 操作 redis 

配置 RedisTemplate 。序列化对象需要实现 Serializable ，或自定义定义序列化器。Serializable 对象将使用 JDK 序列化，效果不太友好，可以自定义序列号器，如使用 GenericJackson2JsonRedisSerializer


```java
@Bean
public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory){
    RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
    redisTemplate.setConnectionFactory(redisConnectionFactory);
    GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
    redisTemplate.setValueSerializer(jsonRedisSerializer);
    redisTemplate.setKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashKeySerializer(new StringRedisSerializer());
    redisTemplate.setHashValueSerializer(jsonRedisSerializer);
    redisTemplate.afterPropertiesSet();
    return redisTemplate;
}
```

实体类

```java
@Data
@ToString
public class User {
    Integer id;
    String name;
    String password;
    Date createTime;
    Date updateTime;
}
```

`redisTemplate.opsForValue()` 可以用来操作 string 类型。在查询前可以查看缓存是否存在，不存在则查询数据库。修改和新增后可以更新缓存

```java
public User findById(Integer id) {
    String key = CACHE_PRIFIX + id;
    ValueOperations<String, User> operation = redisTemplate.opsForValue();
    User user = operation.get(key);
    if(user == null) {
        user = userMapper.findById(id);
        if(user != null) {
            operation.set(key, user);
        }
    }
    return user;
}

public int insert( User user) {
    int count = userMapper.insertSelective(user);
    User user2 = userMapper.findById(user.getId());
    String key = CACHE_PRIFIX + user.getId();

    redisTemplate.opsForValue().set(key, user2);
    return count;
}

public int updateById(User user){
    user.setUpdateTime(new Date());
    int count = userMapper.updateByIdSelective(user);
    User user2 = userMapper.findById(user.getId());
    String key = CACHE_PRIFIX + user.getId();
    redisTemplate.opsForValue().set(key, user2);
    return count;
}
```

可以和 spring-boot-start-cache 一起使用，更加优雅

引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```


```
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        // 生成两套默认配置，通过 Config 对象即可对缓存进行自定义配置
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(1))
                .prefixKeysWith("user:")
                .disableCachingNullValues()
                .serializeKeysWith(keyPair())
                .serializeValuesWith(valuePair());
        return RedisCacheManager
                .builder(factory)
                .withCacheConfiguration("user", cacheConfig)
                .build();
    }

    private RedisSerializationContext.SerializationPair<String> keyPair() {
        return RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer());
    }

    private RedisSerializationContext.SerializationPair<Object> valuePair() {
        return RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer());
    }
```

service 使用 CacheConfig 指定 cacheNames ，方法使用 Cacheable 注解并指定 key 的值，即可自动读取缓存

```java
@Service
@CacheConfig(cacheNames = {"user"})
public class UserService {

    @Cacheable(key="#id")
    public User findByIdWithCache(Integer id) {
        User user = userMapper.findById(id);
        return user;
    }
}
```

