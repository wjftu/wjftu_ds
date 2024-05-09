---
title: 从零开始写一个 Spring
sidebar_position: 3
---

### 从零开始写一个 Spring

参考 https://github.com/iuv/square

首先需要单独 jar 包启动，而不是打成 war 包放到 web 容器里。

引入依赖，嵌入式 tomcat ，以及 logback 日志。版本采用 spring boot 2.7.17 相应的版本。

```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

    <logback.version>1.2.12</logback.version>
    <tomcat.version>9.0.82</tomcat.version>
    <snakeyaml.version>1.30</snakeyaml.version>
</properties>

<dependencies>
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>${logback.version}</version>
    </dependency>

    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-core</artifactId>
        <version>${tomcat.version}</version>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat</groupId>
        <artifactId>tomcat-util</artifactId>
        <version>${tomcat.version}</version>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-jasper</artifactId>
        <version>${tomcat.version}</version>
    </dependency>

</dependencies>
```

启动嵌入式 tomcat


这里使用 target 文件夹作为 projectPath ， web 目录为 projectPath/classes/public （在 resources 文件夹下建 public 文件夹，放静态资源）

```java
import org.apache.catalina.startup.Tomcat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MySpringApp {
    private static final Logger log = LoggerFactory.getLogger(MySpringApp.class);
    private static Tomcat tomcat = null;
    private static String CONTEXT_PATH = "/";
    private static String ENCODING = "UTF-8";
    private static int TOMCAT_PORT = 8080;
    public static void run(Class clazz, String[] args) {

        try {
            String projectPath = clazz.getResource("").getPath();
            //projectPath 为项目下的 target 文件夹
            projectPath = projectPath.substring(0, projectPath.indexOf("classes"));
            long startTime = System.currentTimeMillis();
            tomcat = new Tomcat();
            // 设置Tomcat的工作目录:工程根目录/Tomcat
            tomcat.setBaseDir(projectPath + "/Tomcat");
            tomcat.setPort(TOMCAT_PORT);
            //web 目录
            tomcat.addWebapp(CONTEXT_PATH, projectPath + "/classes/public");
            // 执行这句才能支持JDNI查找
            tomcat.enableNaming();
            tomcat.getConnector().setURIEncoding(ENCODING);
            tomcat.start();
            log.info("Tomcat started on port(s): {} with context path '{}'", TOMCAT_PORT, CONTEXT_PATH);
            log.info("Started Application in {} ms." , (System.currentTimeMillis() - startTime));
            // 保持服务器进程
            tomcat.getServer().await();
        } catch (Exception e) {
            log.error("Application startup failed...", e);
        }
    }
}
```

启动可以看到日志

```
21:07:35.112 [main] INFO com.wjftu.MySpringApp - Tomcat started on port(s): 8080 with context path '/'
21:07:35.131 [main] INFO com.wjftu.MySpringApp - Started Application in 25196 ms.
```

浏览器访问 localhost:8080 可以看到 404 页面，如果放文件在 web 目录下，可以访问到


接下来引入配置文件，以 YAML 配置文件 application.yml 为例。 Spring Boot 使用 snakeyaml 解析 yaml ，引入 snakeyaml 依赖

```xml
<dependency>
    <groupId>org.yaml</groupId>
    <artifactId>snakeyaml</artifactId>
    <version>${snakeyaml.version}</version>
</dependency>

```

写一个解析 yaml 的工具类， convert 方法递归将解析的 map 扁平化

```java
public class LoadApplicationYmlUtil {

    private static final Logger log = LoggerFactory.getLogger(LoadApplicationYmlUtil.class);
    public static Map<String, Object> load(String projectPath){
        var retMap = new HashMap<String, Object>();
        var yaml = new Yaml();
        try(FileInputStream fis = new FileInputStream(projectPath+"/classes/application.yml")) {
            Map<String, Object> yamlMap = (Map<String, Object>)yaml.load(fis);
            if(yamlMap != null && yamlMap.size()>0){
                for(Map.Entry e : yamlMap.entrySet()) {
                    convert("", retMap, yamlMap);
                }
            }
        } catch (FileNotFoundException e) {
            log.warn("application.yml not exits");
        } catch (IOException e) {
            log.error("oad application.yml file error.", e);
        }

        return retMap;
    }

    public static void convert(String prefix, Map<String, Object> retMap, Map<String, Object> yamlMap) {
        if(!"".equals(prefix)) {
            prefix += ".";
        }
        for(Map.Entry<String, Object> e : yamlMap.entrySet()) {
            String key = prefix + e.getKey();
            if(e.getValue() instanceof Map) {
                convert(key, retMap, (Map<String, Object>)e.getValue());
            } else {
                retMap.put(key, e.getValue());
            }
        }
    }
}

```

启动类增加解析 application.yml 功能

```java
public class MySpringApp {
    private static final Logger log = LoggerFactory.getLogger(MySpringApp.class);
    private static Tomcat tomcat = null;
    private static String CONTEXT_PATH = "/";
    private static String ENCODING = "UTF-8";
    private static int TOMCAT_PORT = 8080;

    private static Map<String, Object> CONF_MAP = null;
    public static void run(Class clazz, String[] args) {

        try {
            String projectPath = clazz.getResource("").getPath();
            //projectPath 为项目下的 target 文件夹
            projectPath = projectPath.substring(0, projectPath.indexOf("classes"));
            loadYaml(projectPath);
            long startTime = System.currentTimeMillis();
            tomcat = new Tomcat();
            // 设置Tomcat的工作目录:工程根目录/Tomcat
            tomcat.setBaseDir(projectPath + "/Tomcat");
            tomcat.setPort(TOMCAT_PORT);
            //web 目录
            tomcat.addWebapp(CONTEXT_PATH, projectPath + "/classes/public");
            // 执行这句才能支持JDNI查找
            tomcat.enableNaming();
            tomcat.getConnector().setURIEncoding(ENCODING);
            tomcat.start();
            log.info("Tomcat started on port(s): {} with context path '{}'", TOMCAT_PORT, CONTEXT_PATH);
            log.info("Started Application in {} ms." , (System.currentTimeMillis() - startTime));
            // 保持服务器进程
            tomcat.getServer().await();
        } catch (Exception e) {
            log.error("Application startup failed...", e);
        }
    }

    private static void loadYaml(String projectPath){
        CONF_MAP =  LoadApplicationYmlUtil.load(projectPath);
        if(CONF_MAP.get("server.port") != null){
            TOMCAT_PORT = (Integer)CONF_MAP.get("server.port");
        }
        if(CONF_MAP.get("server.servlet.context-path") != null){
            CONTEXT_PATH = (String)CONF_MAP.get("server.servlet.context-path");
        }
    }
}

```


编写配置文件

```yml
server:
  port: 8081
  servlet:
    context-path: /abc

```

再次启动，可以发现配置生效，解析出来的 map 为：{server.servlet.context-path=/abc, server.port=8081}
