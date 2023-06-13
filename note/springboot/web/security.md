# Spring Boot Security

使用 Spring Boot Security 保护 web 应用

pom 文件中引入 security 的依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

一个简单的 web 应用

```java
@RestController
public class SecurityController {
    @RequestMapping("/hello")
    public String hello(){
        return "hello";
    }
}
```

不做任何配置，启动时会提示

```
Using generated security password: b1dd569e-0d1d-4aa3-ba0d-b5e085a79d10

This generated password is for development use only. Your security configuration must be updated before running your application in production.
```

浏览器访问所有请求会提示输入用户名和密码，输入用户名和密码，默认用户名为 user ，密码为控制台打印的密码

postman 或 curl 访问会返回 401 ，带上用户名和密码可以访问成功

```
$ curl -I http://127.0.0.1:8080/hello
HTTP/1.1 401 
WWW-Authenticate: Basic realm="Realm"

$ curl -u user:b1dd569e-0d1d-4aa3-ba0d-b5e085a79d10 http://127.0.0.1:8080/hello
hello
```

`curl -u` 的原理是将用户名和密码转为 base64 放入请求头中

```
$ echo -n user:b1dd569e-0d1d-4aa3-ba0d-b5e085a79d10 | base64
dXNlcjpiMWRkNTY5ZS0wZDFkLTRhYTMtYmEwZC1iNWUwODVhNzlkMTA=
$ curl -H "Authorization:Basic dXNlcjpiMWRkNTY5ZS0wZDFkLTRhYTMtYmEwZC1iNWUwODVhNzlkMTA=" http://127.0.0.1:8080/hello
hello
```

自定义 UserDetailsService 和 PasswordEncoder

InMemoryUserDetailsManager 将用户凭据存在内存中， NoOpPasswordEncoder 将密码视作普通文本，此时可以使用自定义的用户名和密码访问

```java
@Bean
public UserDetailsService userDetailsService(){
    InMemoryUserDetailsManager userDetailsService = new InMemoryUserDetailsManager();
    UserDetails userDetails = User.withUsername("jeff")
            .password("123456")
            .authorities("read")
            .build();
    userDetailsService.createUser(userDetails);
    return userDetailsService;
}

@Bean
public PasswordEncoder passwordEncoder(){
    return NoOpPasswordEncoder.getInstance();
}
```

继承 WebSecurityConfigurerAdapter 进行配置

```java
@Configuration
public class ProjectConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.h
    }
    
}
```


```

```


