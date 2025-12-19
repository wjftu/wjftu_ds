---
title: Spring Batch
sidebar_position: 7
---

# Spring Batch

轻量级批处理框架

### 组件

1. Job (作业)

批处理工作的最高层级概念，由一个或多个Step组成，可以配置作业参数、重启策略等

2. Step (步骤)

作业的独立阶段，包含 ItemReader，ItemProcessor 和 ItemWriter ，控制事务边界和提交间隔

3. ItemReader

从数据源读取数据，支持文件、数据库、消息中间件、内存，等等

4. ItemProcessor

处理业务逻辑，可过滤或转换数据

5. ItemWriter

写入处理后的数据，支持多种输出目标

### 示例

本文使用 Spring Boot 3.3 ，对应 Spring Batch 5.1

相比之前的版本，很多 API 发生变化



```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.3.10'
    id 'io.spring.dependency-management' version '1.1.7'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-batch'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.h2database:h2'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.batch:spring-batch-test'
}
```


简单的处理流程，从 List 读取字符串，转为大写，控制台输出

这里使用 JobRepository JobRepository 来创建 Step 和 Job ，过去曾经使用 StepBuilderFactory 和 JobBuilderFactory ，已经 deprecated 

```java
@Configuration
public class BatchConfig {

    @Bean
    public ItemReader<String> reader() {
        return new ListItemReader<>(List.of("hello", "world", "spring", "batch"));
    }

    @Bean
    public ItemProcessor<String, String> processor() {
        return String::toUpperCase;
    }

    @Bean
    public ItemWriter<String> writer() {
        return items -> items.forEach(System.out::println);
    }

    @Bean
    public Step step(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("step1", jobRepository)
                .<String, String>chunk(2, transactionManager)
                .reader(reader())
                .processor(processor())
                .writer(writer())
                .build();
    }

    @Bean
    public Job job(JobRepository jobRepository, Step step) {
        return new JobBuilder("job1", jobRepository)
                .start(step)
                .build();
    }
}
```


StepExecutionListener 可以添加 job 前后自定义逻辑

JobParameters 可以用来传入执行参数

```java
@Component
public class ParameterPrinter implements StepExecutionListener {

    @Override
    public void beforeStep(StepExecution stepExecution) {
        JobParameters jobParameters = stepExecution.getJobParameters();
        String value = jobParameters.getString("key1");
        System.out.println("Job Parameter 'key1' = " + value);
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        return ExitStatus.COMPLETED;
    }
}
```

JobLauncher 可以用来执行 job ，并可以在执行时传入参数。默认实现类 TaskExecutorJobLauncher ，支持异步执行.
只要定义了 Job 的 Bean ，它会自动执行，无需手动执行。 

```java
    private JobLauncher jobLauncher;
    private Job job;
    JobParameters jobParameters = new JobParametersBuilder()
            .addString("key1", "value1")
            .toJobParameters();
    jobLauncher.run(job, jobParameters);
```


输出

```
2025-04-25T02:00:24.255+08:00  INFO 20285 --- [           main] o.s.b.a.b.JobLauncherApplicationRunner   : Running default command line with: []
2025-04-25T02:00:24.286+08:00  INFO 20285 --- [           main] o.s.b.c.l.support.SimpleJobLauncher      : Job: [SimpleJob: [name=job1]] launched with the following parameters: [{}]
2025-04-25T02:00:24.296+08:00  INFO 20285 --- [           main] o.s.batch.core.job.SimpleStepHandler     : Executing step: [step1]
HELLO
WORLD
SPRING
BATCH
2025-04-25T02:00:24.305+08:00  INFO 20285 --- [           main] o.s.batch.core.step.AbstractStep         : Step: [step1] executed in 8ms
2025-04-25T02:00:24.308+08:00  INFO 20285 --- [           main] o.s.b.c.l.support.SimpleJobLauncher      : Job: [SimpleJob: [name=job1]] completed with the following parameters: [{}] and the following status: [COMPLETED] in 16ms
2025-04-25T02:00:24.313+08:00  INFO 20285 --- [           main] o.s.b.c.l.support.SimpleJobLauncher      : Job: [SimpleJob: [name=job1]] launched with the following parameters: [{'key1':'{value=value1, type=class java.lang.String, identifying=true}'}]
2025-04-25T02:00:24.316+08:00  INFO 20285 --- [           main] o.s.batch.core.job.SimpleStepHandler     : Executing step: [step1]
2025-04-25T02:00:24.318+08:00  INFO 20285 --- [           main] o.s.batch.core.step.AbstractStep         : Step: [step1] executed in 1ms
2025-04-25T02:00:24.320+08:00  INFO 20285 --- [           main] o.s.b.c.l.support.SimpleJobLauncher      : Job: [SimpleJob: [name=job1]] completed with the following parameters: [{'key1':'{value=value1, type=class java.lang.String, identifying=true}'}] and the following status: [COMPLETED] in 5ms
```

### 读取文件写入数据库

从 csv 文件读取数据，并写入 PostgreSQL 数据库

数据库实体类

```java
public class People {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    // getter and setter
}
```

建表

```sql
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);
```

csv 文件

```
firstName,lastName,email
John,Doe,john.doe@example.com
Jane,Smith,jane.smith@example.com
Mark,Johnson,mark.johnson@example.com
Emily,Williams,emily.williams@example.com
```

配置类

```java
@Configuration
public class CsvBatchConfig {
    @Bean
    public FlatFileItemReader<People> reader() {
        return new FlatFileItemReaderBuilder<People>()
                .name("userItemReader")
                .resource(new ClassPathResource("data/user.csv"))
                .delimited()
                .names( "firstName", "lastName", "email")
                .fieldSetMapper(new BeanWrapperFieldSetMapper<>() {{
                    setTargetType(People.class);
                }})
                .linesToSkip(1)
                .build();
    }

    @Bean
    public JdbcBatchItemWriter<People> writer(DataSource dataSource) {
        return new JdbcBatchItemWriterBuilder<People>()
                .itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
                .sql("INSERT INTO people ( first_name, last_name, email) VALUES ( :firstName, :lastName, :email)")
                .dataSource(dataSource)
                .build();
    }

    @Bean
    public Job importUserJob(JobRepository jobRepository, Step importStep) {
        return new JobBuilder("importUserJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(importStep)
                .build();
    }

    @Bean
    public Step importStep(JobRepository jobRepository,
                           PlatformTransactionManager transactionManager,
                           FlatFileItemReader<People> reader,
                           JdbcBatchItemWriter<People> writer) {
        return new StepBuilder("importStep", jobRepository)
                .<People, People>chunk(10, transactionManager)
                .reader(reader)
                .writer(writer)
                .build();
    }
```

设置 spring.batch.jdbc.initialize-schema 为 always ，它会自动创建 batch 框架用到的表，默认值为 never ，生产环境建议手动创建

```yaml
spring:
    datasource:
        driver-class-name: org.postgresql.Driver
        url: jdbc:postgresql://ip:port/defaultdb?sslmode=require
        username: user
        password: passw0rd
    batch:
        job:
            enabled: true
        jdbc:
            initialize-schema: always
```

batch 会创建这些表：  
BATCH_JOB_INSTANCE  
BATCH_JOB_EXECUTION  
BATCH_JOB_EXECUTION_PARAMS  
BATCH_STEP_EXECUTION  
BATCH_STEP_EXECUTION_CONTEXT  
BATCH_JOB_EXECUTION_CONTEXT  

建表和删表语句在 spring-batch-core 的 org.springframework.batch.core 下，例如 postgre 为 schema-postgresql.sql 

可以通过 table-prefix 配置前缀，配置后表原来的前缀会改变，例如 BATCH_JOB_INSTANCE 改为 PRE_JOB_INSTANCE 。注意配置前缀后自动建表不会用配置的前缀，需要关闭自动建表并手动创建

```yml
spring:
  batch:
    job:
      enabled: true
    jdbc:
      initialize-schema: never
      table-prefix: PRE_
```
