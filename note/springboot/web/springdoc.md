# Springdoc

SpringDoc 是一个用于自动生成 OpenAPI 3.0（Swagger）文档 的 Java 库，专为 Spring Boot 应用程序设计。它简化了 RESTful API 的文档化过程，通过扫描 Spring 的注解（如 @RestController、@GetMapping 等）自动生成交互式 API 文档，并提供 Swagger UI 界面供开发者测试接口。

Springdoc 与 Spring Boot 的版本兼容性：

| Spring Boot Versions | Springdoc OpenAPI Versions |
| --- | --- |
| 3.4 | 2.7-2.8 |
| 3.3 | 2.6 |
| 3.2 | 2.3-2.5 |
| 3.1 | 2.2 |
| 3.0 | 2.0-2.1 |
| 2.7 1.5 | 1.6 |

引入依赖

```
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0'
}
```

常用配置

```properties
# Change Swagger UI path (default is /swagger-ui.html)
springdoc.swagger-ui.path=/swagger-ui.html

# Change OpenAPI spec path (default is /v3/api-docs)
springdoc.api-docs.path=/v3/api-docs

# Enable or disable Swagger UI
springdoc.swagger-ui.enabled=true

# Enable or disable OpenAPI docs endpoint
springdoc.api-docs.enabled=true

# Show duration of each request
springdoc.swagger-ui.display-request-duration=true
```


启动后访问 http://localhost:8080/swagger-ui/index.html ，即可看到 swagger 的 ui

可以通过配置一个 OpenAPI bean ，修改 ui 的一些 metadata

```java
@Configuration
public class SpringdocConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Springdoc Demo")
                .version("1.0")
                .description("SpringDoc Demo Application")
                .contact(new Contact()
                    .name("Jeff Wang")
                    .email("your@email.com")));
    }
}
```

创建一个 Controller ，启动应用，可以在 ui 上点击 try it out 进行测试，可以输入参数 name 进行测试

@Operation @Parameter 可以配置接口和参数的 metadata

```java
@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    @Operation(summary = "Say Hello", description = "Returns a greeting message.")
    public String hello(
        @Parameter(description = "Name of the person to greet")
        @RequestParam(defaultValue = "World") String name) {
        return "Hello, " + name + "!";
    }
}

```

ui 上会显示对应的 curl 命令

```
curl -X 'GET' \
  'http://localhost:8080/api/hello?name=world' \
  -H 'accept: */*'
```

Controller 新增返回 DTO

```java
@GetMapping("/greet")
@Operation(summary = "Greet user with structured response")
public GreetingResponse greet(@RequestParam String name) {
    return new GreetingResponse("Hello, " + name + "!");
}
```

@Schema 可以标注 DTO ，ui 上会显示对 Schema 的描述

```java
@Schema(description = "Greeting response")
public class GreetingResponse {

    @Schema(description = "Greeting message", example = "Hello, John!")
    private String message;

    public GreetingResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
```

与 Spring Security 一起使用

在 Spring Security 中配置 http basic ，并放行 swagger ui ，需要放行 /v3/api-docs/** 不然 ui 也打不开


```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()); // HTTP Basic Auth

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withUsername("user")
            .password("{noop}password") // Use PasswordEncoder in production
            .roles("USER")
            .build();

        return new InMemoryUserDetailsManager(user);
    }
}

```

配置 Springdoc 支持 http basic 鉴权，在 ui 右上角会有 authorize 按钮

```java
@Bean
public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info().title("Demo API").version("1.0"))
        .components(new Components()
            .addSecuritySchemes("basic-auth",
                new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("basic")))
        .addSecurityItem(new SecurityRequirement().addList("basic-auth"));
}
```

authorize 后请求会带上 Authorization

```
curl -X 'GET' \
  'http://localhost:8080/api/hello?name=World' \
  -H 'accept: */*' \
  -H 'Authorization: Basic dXNlcjpwYXNzd29yZA=='
```