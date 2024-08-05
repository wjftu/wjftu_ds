---
title: 多线程
sidebar_position: 2
---

### 基本使用

创建线程有多种方法：

- 继承 Thread 类  
- 实现 Runnable 接口  
- 实现 Callable 接口  

等等


1. 继承 Thread 类，并重写 run 方法

新建对象，运行 start 方法即可启动线程。如果直接运行 run 方法只会在当前线程运行一个普通方法

```java
static class MyThread extends Thread {

    @Override
    public void run() {
        System.out.println("Hello World");
    }
}

public static void main(String[] args) {
    new MyThread().start();
}
```

2. 实现 Runnable 接口并实现 run 方法

由于 Runnable 是接口，因此可以同时继承其它的类或实现接口。使用这个 Runnable 创建一个 Thread 并运行 start 方法即可启动一个线程。也可以使用 lambda 表达式更优雅地创建。

```java
static class MyRunnable implements Runnable {

    @Override
    public void run() {
        System.out.println("Hello World");
    }
}

public static void main(String[] args) {
    new Thread(new MyRunnable()).start();

    new Thread(() -> {
        System.out.println("new Thread");
    });
}
```

3. 实现 Callable 接口  

如果需要带返回值的线程可以实现 Callable 接口，创建一个 FutureTask 。启动线程后，使用 FutureTask 的 get 方法获取返回值，get 方法会阻塞直到返回，也可以传入超时时间

```java
static class MyCallable implements Callable<String> {

    @Override
    public String call() throws Exception {
        return "Hello World";
    }
}

public static void main(String[] args) {
    FutureTask<String> futureTask = new FutureTask<>(new MyCallable());
    new Thread(futureTask).start();
    try {
        System.out.println(futureTask.get());
    } catch (InterruptedException | ExecutionException e) {
        e.printStackTrace();
    }

    FutureTask<String> futureTask2 = new FutureTask<>(() -> {
        return "Hello World";
    });

    new Thread(futureTask2).start();
    try {
        System.out.println(futureTask2.get(1000, java.util.concurrent.TimeUnit.MILLISECONDS));
    } catch (InterruptedException | ExecutionException | TimeoutException e) {
        e.printStackTrace();
    }

}
```

### 线程池


线程的池化技术，类似于数据库连接池、HTTP 连接池。线程池是一个线程的资源池，需要线程时从池中获取，用完后不会立即销毁，而是放回池中以后复用。避免了线程反复创建和回收的开销

创建方法：

1. 通过 ThreadPoolExecutor 的构造函数创建

线程池的核心线程数量，线程池的最大线程数，空闲线程存活时间，空闲线程存活时间单位，等待执行任务的队列，线程工厂（通常默认即可），拒绝策略

```java
public ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue)
public ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory) 
public ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, RejectedExecutionHandler handler)
public ThreadPoolExecutor(int corePoolSize, int maximumPoolSize, long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue, ThreadFactory threadFactory, RejectedExecutionHandler handler) 
```

使用 ThreadPoolExecutor 的构造函数创建线程池并启动

```java
ThreadPoolExecutor exec = new ThreadPoolExecutor(2, 3, 10, TimeUnit.SECONDS, new LinkedBlockingQueue<>(1), Executors.defaultThreadFactory(), new ThreadPoolExecutor.AbortPolicy());
Runnable r = () -> {
    int activeCount = exec.getActiveCount();
    System.out.println(Thread.currentThread() + " " + activeCount);
    try {
        Thread.sleep(100);
    } catch (InterruptedException e) {
    }
};
try {
    for (int i = 0; i < 5; i++) {
        exec.submit(r);
        Thread.sleep(10);
    }
} catch (Exception e) {
    e.printStackTrace();
}
exec.shutdown();
```



输出

```
Thread[pool-1-thread-1,5,main] 1
Thread[pool-1-thread-2,5,main] 2
Thread[pool-1-thread-3,5,main] 3
java.util.concurrent.RejectedExecutionException: Task java.util.concurrent.FutureTask@37a71e93 rejected from java.util.concurrent.ThreadPoolExecutor@7e6cbb7a[Running, pool size = 3, active threads = 3, queued tasks = 1, completed tasks = 0]
	at java.util.concurrent.ThreadPoolExecutor$AbortPolicy.rejectedExecution(ThreadPoolExecutor.java:2063)
	at java.util.concurrent.ThreadPoolExecutor.reject(ThreadPoolExecutor.java:830)
	at java.util.concurrent.ThreadPoolExecutor.execute(ThreadPoolExecutor.java:1379)
	at java.util.concurrent.AbstractExecutorService.submit(AbstractExecutorService.java:112)
	at basic.TestThread.main(TestThread.java:44)
Thread[pool-1-thread-1,5,main] 3
```

2. 通过工具类 Executors 创建线程池

Executors 工具类提供多种创建线程池的方法，但不太推荐使用。Executors 本质也是用 ThreadPoolExecutor 构造函数创建线程，自己手动创建更易于维护，而且 Executors 的创建方法有一些不足，例如无界队列导致 OOM

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>());
}
```

