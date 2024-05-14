---
title: 动态配置多数据源
sidebar_position: 2
---

AbstractRoutingDataSource 可以帮我们实现动态配置多数据源，并可以在运行时添加和删除数据源

定义一个类，继承 AbstractRoutingDataSource ，实现 determineCurrentLookupKey 方法， determineCurrentLookupKey 方法用于在运行时找到数据源的 key ，然后根据 key 找到需要使用的数据源。创建一个 addDataSource 方法，用于在运行时添加数据源，传入驱动名称，jdbc url，用户名，密码，反射得到驱动类，构造一个简单的 SimpleDriverDataSource 数据源。 setTargetDataSources 用于设置数据源，传入一个 map ，map 的 key 是 determineCurrentLookupKey 返回的 key ，这里定义 jdbc url 为数据源的 key。 afterPropertiesSet 方法在 setTargetDataSources 后调用，让配置生效。

```java
public class DynamicDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceKeyHolder.getKey();
    }

    public void addDataSource(String driverClassName, String url, String username, String password) {
        try {
            Class<?> clazz = Class.forName(driverClassName);
            Driver driver = (Driver) clazz.newInstance();
            DataSource dataSource = new SimpleDriverDataSource(driver, url, username, password);
            Map<Object,Object> targetDataSources = new HashMap<>();
            targetDataSources.put(url, dataSource);
            setTargetDataSources(targetDataSources);
            afterPropertiesSet();
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        } catch (InstantiationException e) {
            throw new RuntimeException(e);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

}
```

从 AbstractRoutingDataSource 的源码可以看到，setTargetDataSources 只是把 map 传入，调用 afterPropertiesSet 方法才会重新设置 resolvedDataSources 让配置的数据源 map 生效。setTargetDataSources 需要全量配置，否则之前的配置会消失。

```java
public void setTargetDataSources(Map<Object, Object> targetDataSources) {
    this.targetDataSources = targetDataSources;
}

public void afterPropertiesSet() {
    if (this.targetDataSources == null) {
        throw new IllegalArgumentException("Property 'targetDataSources' is required");
    } else {
        this.resolvedDataSources = CollectionUtils.newHashMap(this.targetDataSources.size());
        this.targetDataSources.forEach((key, value) -> {
            Object lookupKey = this.resolveSpecifiedLookupKey(key);
            DataSource dataSource = this.resolveSpecifiedDataSource(value);
            this.resolvedDataSources.put(lookupKey, dataSource);
        });
        if (this.defaultTargetDataSource != null) {
            this.resolvedDefaultDataSource = this.resolveSpecifiedDataSource(this.defaultTargetDataSource);
        }

    }
}
```

DataSourceKeyHolder 通过 ThreadLocal 来配置当前线程使用的数据源名字。

```java
public class DataSourceKeyHolder {

    private static ThreadLocal<String> threadLocal = new ThreadLocal<>();

    public static String getKey() {
        return threadLocal.get();
    }

    public static void setKey(String key) {
        threadLocal.set(key);
    }

}
```

数据源配置类，dataSource 创建一个普通数据源作为默认数据源，再创建一个 DynamicDataSource 的 bean ，用于动态新增和管理数据源，设置 defaultDataSource 为默认数据源。当 determineCurrentLookupKey 方法返回空或返回的数据源不存在，则使用默认的。

```java
@Configuration
public class DataSourceConfig {

    @Bean(name = "defaultDataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    DataSource dataSource() {
        DataSource dataSource = DataSourceBuilder.create()
                .build();
        return dataSource;
    }

    @Bean(name = "dataSource")
    @Primary
    DataSource dynamicDataSource(
            @Qualifier("defaultDataSource")
            DataSource defaultDataSource
    ) {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        dynamicDataSource.setDefaultTargetDataSource(defaultDataSource);
        dynamicDataSource.setTargetDataSources(new HashMap<>());

        return dynamicDataSource;
    }


}

```



测试类，使用 mybatis 进行测试

第一次运行，返回的是默认数据源的结果。然后动态添加数据源，第二次运行，还是默认数据源的结果，因为没有在 DataSourceKeyHolder 中设置当前线程数据源。在 DataSourceKeyHolder 设置当前线程数据源后，第三次运行，返回新增数据源的结果。


```java
@SpringBootTest
public class TestMapper {

    @Autowired
    StudentMapper studentMapper;

    @Autowired
    DynamicDataSource dynamicDataSourced;

    @Test
    public void testAddDataSourceAtRuntime() {

        ArrayList<Student> list = studentMapper.findAll();

        String url = "jdbc:mysql://a.com:3307/mydb";
        String driverClassName = "com.mysql.cj.jdbc.Driver";
        String username = "aaa";
        String password = "16fccf4470fd";

        dynamicDataSourced.addDataSource(driverClassName, url, username, password);

        list = studentMapper.findAll();
        System.out.println(list);
        DataSourceKeyHolder.setKey(url);

        list = studentMapper.findAll();
        System.out.println(list);

    }
}
```


