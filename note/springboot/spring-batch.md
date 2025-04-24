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

JobLauncher 可以用来执行 job ，并可以在执行时传入参数。默认实现类 TaskExecutorJobLauncher ，支持异步执行 

```java
@Component
public class JobLauncherRunner implements CommandLineRunner {

    private final JobLauncher jobLauncher;
    private final Job job;

    public JobLauncherRunner(JobLauncher jobLauncher, Job job) {
        this.jobLauncher = jobLauncher;
        this.job = job;
    }

    @Override
    public void run(String... args) throws Exception {
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("key1", "value1")
                .toJobParameters();

        jobLauncher.run(job, jobParameters);
    }
}
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

