---
title: Spring Reactor
sidebar_position: 9
---

# Spring Reactor

Reactor 是一个基于 Reactive Streams 规范的响应式编程库，专门为 JVM 设计的非阻塞异步应用程序开发框架。它是响应式 web 框架 Spring WebFlux 的底层核心库。

### 核心概念

1. 响应式编程模型

Reactor 实现了发布-订阅模式，其中：

发布者(Publisher)：产生数据（Flux 和 Mono）

订阅者(Subscriber)：消费数据

处理器(Processor)：既是发布者又是订阅者



2. 主要组件

Flux（零个到无限个元素） 和 Mono（零个或一个元素）

正如之前介绍的，这是 Reactor 提供的两种核心发布者类型。

Schedulers 提供线程调度能力：

Schedulers.immediate() - 当前线程

Schedulers.single() - 单一线程

Schedulers.parallel() - 并行线程池

Schedulers.boundedElastic() - 有界弹性线程池

Operators 丰富的操作符：

转换操作：map, flatMap, concatMap

过滤操作：filter, take, skip

组合操作：merge, zip, concat

错误处理：onErrorReturn, onErrorResume, retry

### 示例

依赖是 io.projectreactor:reactor-core ，也可以通过 org.springframework.boot:spring-boot-starter-webflux 间接引入依赖

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'io.projectreactor:reactor-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'

}

tasks.named('test') {
    useJUnitPlatform()
}
```


可以用 Flux.just() 方法创建一个 Flux 

如果没有订阅，数据不会流动。可以调用 subscribe 方法传入 comsume 进行订阅

```java
Flux<String> flux = Flux.just("Tom", "Jim", "John");
flux.subscribe(System.out::println);
```

可以用 StepVerifier 进行测试

```java
Flux<String> flux = Flux.just("Tom", "Jim", "John");
StepVerifier.create(flux)
        .expectNext("Tom")
        .expectNext("Jim")
        .expectNext("John")
        .verifyComplete();
```

一些创建 Flux 的方法

```java
String[] names = {"Tom", "Jim", "John"};
Flux<String> flux = Flux.fromArray(names);
Flux<String> flux2 = Flux.fromIterable(Arrays.asList("Tom", "Jim", "John"));
Flux<Integer> flux3 = Flux.range(1, 5);
Stream<String> stream = Stream.of("Tom", "Jim", "John");
Flux<String> flux4 = Flux.fromStream(stream);
```

Merge 可以合并两个 Flux 

merge 不能保证顺序，这里通过 delay 让他们交替执行

```java
Flux<String> flux1 = Flux.just("Tom", "Jim", "John")
        .delayElements(Duration.ofMillis(100));
Flux<String> flux2 = Flux.just("Jeff", "Mary", "Sally")
        .delaySubscription(Duration.ofMillis(50))
        .delayElements(Duration.ofMillis(100));
Flux<String> merged = flux1.mergeWith(flux2);
StepVerifier.create(merged)
        .expectNext("Tom")
        .expectNext("Jeff")
        .expectNext("Jim")
        .expectNext("Mary")
        .expectNext("John")
        .expectNext("Sally")
        .verifyComplete();
```

zip 操作可从每个 Flux 取一个元素创建新的 Flux

```java
Flux<String> color = Flux.just("red", "green");
Flux<String> shape = Flux.just("square", "circle");
Flux<String> zipFlux = Flux.zip(color, shape, (c, s) -> c + " " + s);
StepVerifier.create(zipFlux)
        .expectNext("red square")
        .expectNext("green circle")
        .verifyComplete();
```

可以用 firstWithSignal 方法选择从第一个响应的 Flux 创建 Flux

```java
Flux<Integer> slow = Flux.just(1).delaySubscription(Duration.ofSeconds(1));
Flux<Integer> fast = Flux.just(2);
Flux<Integer> first = Flux.firstWithSignal(slow, fast);
StepVerifier.create(first)
        .expectNext(2)
        .verifyComplete();
```

skip 方法可以跳过一定数量或者一定时间的元素

```java
Flux<Integer> flux = Flux.range(1, 3).skip(1);
StepVerifier.create(flux)
        .expectNext(2)
        .expectNext(3)
        .verifyComplete();

Flux<Integer> flux = Flux.range(1, 3)
        .delayElements(Duration.ofSeconds(1))
        .skip(Duration.ofMillis(1500));
StepVerifier.create(flux)
        .expectNext(2)
        .expectNext(3)
        .verifyComplete();
```

take 取一定数量或一段时间的元素，然后取消订阅

```java
Flux<Integer> flux = Flux.range(1, 3).take(1);
StepVerifier.create(flux)
        .expectNext(1)
        .verifyComplete();

Flux<Integer> flux = Flux.range(1, 3)
        .delayElements(Duration.ofSeconds(1))
        .take(Duration.ofMillis(1500));
StepVerifier.create(flux)
        .expectNext(1)
        .verifyComplete();
```

filter 可以过滤元素

```java
Flux<Integer> flux = Flux.range(1, 3)
        .filter(i -> i % 2 == 0);
StepVerifier.create(flux)
        .expectNext(2)
        .verifyComplete();
```

distinct 去掉重复元素

```java
Flux<String> flux = Flux.just("hello", "hi", "hello");
StepVerifier.create(flux.distinct())
        .expectNext("hello", "hi")
        .verifyComplete();
```

map 可以转换元素

```java
Flux<String> flux = Flux.just("Jim", "John")
        .map(s -> s.toUpperCase());
StepVerifier.create(flux)
        .expectNext("JIM", "JOHN")
        .verifyComplete();
```

flatMap 可以将元素转为 Flux 或 Mono ，可以与 subscribeOn(Schedulers.parallel()) 一起使用，实现异步操作

```java
Flux<Integer> flux = Flux.just("Jim", "John")
        .flatMap(s -> Flux.just(s.length()))
        .subscribeOn(Schedulers.parallel());
StepVerifier.create(flux)
        .expectNextMatches(i -> i == 3 || i == 4)
        .expectNextMatches(i -> i == 3 || i == 4)
        .verifyComplete();
```

数据缓冲，buffer 可以创建 List 集合的 Flux

```java
Flux<String> flux = Flux.just("Tom", "Jim", "John", "Jeff", "Mary");
Flux<List<String>> buffer = flux.buffer(3);
StepVerifier.create(buffer)
        .expectNext(Arrays.asList("Tom", "Jim", "John"))
        .expectNext(Arrays.asList("Jeff", "Mary"))
        .verifyComplete();
```

不带参数的 buffer 可以将 flux 转化为含有一个 List 的 Flux，collectList 方法可转为 Mono

```java
Flux<String> flux = Flux.just("Tom", "Jim", "John", "Jeff", "Mary");
Flux<List<String>> buffer1 = flux.buffer();
Mono<List<String>> buffer2 = flux.collectList();
```

逻辑判断，返回 Mono ，都满足则 all 返回 true ，任意满足则 any 返回 true

```java
Flux<String> flux = Flux.just("Tom", "Jim", "John", "Jeff", "Mary");
Mono<Boolean> all = flux.all(name -> name.length() >= 3);
Mono<Boolean> any = flux.any(name -> "Mary".equals(name));
```

