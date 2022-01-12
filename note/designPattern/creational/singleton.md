# 单例模式

单例模式（ Singleton Pattern) 是 Java 中最简单的设计模式之一。



这种模式涉及单一的类，该类负责创建自己的对象，并且确保只能创建单个对象。这个类提供一种访问其唯一对象的方式。



### 饿汉式



方法1： 静态变量方式

~~~java
public class Singleton{
    // 1. 私有构造方法
	private Singleton(){}
    // 2. 在本类中创建本类对象
    private static Singleton instance=new Singleton();
    // 3. 提供公共访问方式
    public static Singleton getInstance(){
        return instance;
    }
}
~~~



方法2： 静态代码块方式



~~~java
public class Singleton{
    // 1. 私有构造方法
	private Singleton(){}
    // 2. 声明该类的变量
    private static Singleton instance;
    // 3. 在静态代码块中赋值
    static{
        instance = new Singleton();
    }
    // 4. 对外提供获取该类对象的方法
    public static Singleton getInstance(){
        return instance;
    }
}
~~~


方法3：

枚举，充分利用枚举的特点。这是唯一不会被攻破的方法


~~~java
public enum Singleton {
    ISTANCE;
}
~~~

测试类
~~~java
public class TestEnum {
    public static void main(String[] args) {
        Singleton s1=Singleton.INSTANCE;
        Singleton s2=Singleton.INSTANCE;
        System.out.println(s1==s2);
    }
}
~~~

饿汉式的缺点：如果该类很大，又一直没有使用，会造成内存浪费。





### 懒汉式

方法1：

线程不安全的方法，适合单线程
~~~java
public class Singleton {

    private Singleton(){}

    private static Singleton instance;

    public static Singleton getInstance(){
        if(instance==null){
            instance=new Singleton();
        }
        return instance;
    }
    
}
~~~

可以给 getInstance 方法加锁实现线程安全，但是这种方法很低效，因为给一些读操作也加上了锁，而读操作本身就是线程安全的

~~~java
public static synchronized Singleton getInstance(){
    if(instance==null){
        instance=new Singleton();
    }
    return instance;
}
~~~

方法2：

支持多线程的更好的实现方式，双重检查锁

~~~java
public class Singleton {

    private Singleton(){}
    //为了防止JVM进行指令重排，导致空指针
    private static volatile Singleton instance;

    public static synchronized Singleton getInstance(){
        //第一次判断，如果不为null，不需要抢占锁，直接返回对象
        if(instance==null){
            synchronized(Singleton.class){
                //第二次判断，此时由于有锁，不会两个线程同时执行
                if(instance==null){
                    instance=new Singleton();
                }
            }
        }
        return instance;
    }
}
~~~

方法3：

由于 JVM 在加载外部类过程中，是不会加载静态内部类的。只有内部类的属性或方法被调用时才会被加载。静态属性被 static 修饰，保证指挥实例化一次，并保证了实例化顺序。

~~~java
public class Singleton {
    //私有构造方法
    private Singleton(){}
    //静态内部类
    private static class SingletonHolder{
        //内部类声明并初始化外部类对象，调用时实现，只实现一次
        private static final Singleton INSTANCE=new Singleton();
    }
    //公共访问方式
    public static Singleton getInstance(){
        return SingletonHolder.INSTANCE;
    }
}
~~~

