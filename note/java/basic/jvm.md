# JVM

### 类加载

java 文件经过编译变成字节码 class 文件，class 文件被类加载器加载进入方法区，生成 Class 对象放在堆中

什么时候会加载类：

1. 运行 main 方法  
2. new 对象
3. 使用静态变量或方法

类加载七大 流程： 加载，验证，准备，解析，初始化，使用，卸载

加载：通过全名（包名和类名）读取字节流，将字节流代表的数据结构转化为方法区的结构，在堆中生成一个此类的 java.lang.Class 对象，作为此类的访问入口 

验证：对类进行验证，保证类加载正确性，确保不会危害虚拟机的安全：文件格式验证，源数据验证，字节码验证，符号引用验证

准备：为变量分配内存并设置初始值 

```java
class A {
    //类变量，准备阶段分配到方法区，并设置初始值
    static int a;
    //不处理，final 修饰的在编译阶段已分配好
    final static int b = 0;
    //实例变量，只在堆中分配
    int c;
}
```

解析：将常量池中的符号引用转为直接引用

```java
final String STR = "a";

//解析前
System.out.println(STR);
//解析后
System.out.println("a"); 
```

初始化：当主动引用，使用非 final 修饰的静态成员，调用静态方法，反射调用，会触发类初始化。运行主类 main 方法时，虚拟机会初始化主类。当发现父类没有初始化，会先初始化父类。

卸载发生的情况：

1. 执行 `System.exit();`
2. 程序正常终止
3. 程序异常结束
4. 操作系统异常导致 jvm 进程终止 



类加载器包括启动类加载器（Bootstrap），扩展类加载器（ExtClassLoader），系统类加载器（AppClassLoader）。启动类加载器加载系统属性 `sun.boot.class.path` 路径下的类，它依赖于操作系统，是虚拟机实现的一部分 。扩展类加载器加载 `java.ext.dirs` 下的类。系统类加载器加载 `java.class.path` 下的类，我们写的代码和使用的依赖是通过这个类加载器加载的。

如果需要自定义类加载器，可以继承 `java.lang.ClassLoader` 并重写其方法

类加载器加载的时候会向上委托，先用自己的类加载器判断类是否已经被加载，如果被加载了饭回 Class 对象，如果没有则委托给父加载器，直到根类加载器。如果父类加载器反馈无法加载，则交给子类加载器加载 


### 栈

cpu 内部存在程序计数器，记录下一条指令地址。JVM 也类似，每个线程有一个记录当前 bytecode 的地址的计数器。CPU 不停切换上下文，线程不断切换，线程不断被中止和恢复，需要记录执行的位置。分支，跳转，循环，线程切换都依赖于程序计数器，它是线程隔离的，占用空间非常小，不会发生 OutofMemoryError，当执行 native 方法时程序计数器为空。

每个线程会有一个虚拟机栈。每个栈帧包含局部变量表（Local variable table），方法返回地址，操作数栈，动态链接，其他信息。局部变量表的数据类型是 slot ，占用 32 bit ，小于 32 bit 的数据类型装一个 slot ，大于的装 2 个。局部变量表也存放对象引用

栈的内存默认 1 MB，当内存溢出报错 java.lang. StackOverFlowError

### 堆

对象储存在堆中，被栈和堆中的变量引用，当不再使用时不再被引用，被垃圾回收算法回收掉。堆是所有线程共享的，可以被所有栈帧访问。当空间用完时报错 OutofMemoryError

可以通过 `-Xms` 和 `-Xmx` 设置堆的初始化大小和最大大小（其中 `-X` 表示运行参数），默认初始化大小为操作系统内存大小的 1/64 ，默认最大大小为操作系统内存大小的 1/4


例如：

```
java -Xms512m -Xmx512m 
```

可以使用 jmap 查看堆内部结构

```
jmap -heap [pid]
jmap -histo:live [pid]
```

默认新生代占堆内存的 1/3，老年代默认占 2/3，元空间（metaspace）默认 20M ，新生代老年代比例可以通过 `-XX:newRatio=<n>` 来设置

新生代（new generation）包括 eden 区和 survivor 区， survivor 区 包括 from 和 to ，空间大小 eden : from : to 默认值为 8:1:1 ，可以通过 `-XX:survivorRatio=<n>` 来设置

JVM 参数 `-XX:+PrintGCDetails` 输出 GC 详细日志， `-XX:+PrintHeapAtGC` 打印 GC 前后状态

### 方法区

方法区在 java 8 后被元空间取代

方法区保存了类的域信息（成员变量）的（类型，声明顺序，修饰符，等 ），方法的信息（方法名，参数类型，修饰符，返回值类型，字节码，异常表等）


常量池（Constants poll）是为了避免频繁创建销毁变量影响性能，实现变量共享。例如字符串常量池，编译阶段把所有字符串放入

```java
public void test(){
    String s1 = "a"; //运行时常量池中
    String s2 = new String("a"); //在堆中创建一个 String 对象
    boolean b = s1 == s2; //false
}
```