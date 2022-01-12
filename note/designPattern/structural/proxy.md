# 代理模式

由于某些原因，需要给对象提供一个代理以控制对该对象的访问。访问对象不适合或不能直接引用目标对象，代理对象充当方位对象和目标对象的中介。

java的代理模式分为静态代理和动态代理。静态代理在编译期生成，动态代理则在运行时动态生成。动态代理又分为 JDK 代理和 CGLib 代理两种

代理模式的三种角色：
* 抽象主题（subject）类：通过接口或抽象类声明真实主题和代理对象实现的业务方法。
* 真实主题（real subject）类：实现抽象主题的具体业务，是代理对象代表的真实对象，是最终要引用的对象。
* 代理（proxy）类：提供了与真实主题相同的接口，内部含有真实主题的引用，可以访问、控制、扩展真实主题。

### 静态代理

以代售点买火车票为例子：

抽象主题：
~~~java
public interface SellTickets {
    void sell();
}
~~~

真实主题：
~~~java
public class TrainStation implements SellTickets{
    @Override
    public void sell() {
        System.out.println("火车站卖票");
    }
}
~~~

代理对象，扩展真实主题：
~~~java
public class ProxyPoint implements SellTickets {
    TrainStation trainStation=new TrainStation();
    @Override
    public void sell() {
        System.out.println("替顾客去火车站买票");
        trainStation.sell();
        System.out.println("代售点替顾客买了票");
    }
}
~~~

测试类：
~~~java
public class Client {
    public static void main(String[] args) {
        ProxyPoint proxyPoint=new ProxyPoint();
        proxyPoint.sell();
    }
}
~~~


### JDK 动态代理

java 中提供了一个动态代理类 Proxy，通过它的 newProxyInstance 方法获取代理对象

newProxyInstance 方法的三个参数
~~~java
/*
    ClassLoader loader : 类加载器，用于加载代理类，可以通过目标对象获取
    Class<?>[] interfaces ： 代理类实现的接口的字节码对象
    InvocationHandler h ： 代理对象的调用处理程序
*/
public static Object newProxyInstance(ClassLoader loader,
                                        Class<?>[] interfaces,
                                        InvocationHandler h)
~~~


InvocationHandler 的 invoke 方法
~~~java
/*
    Object proxy ： 代理对象，和proxyObject对象是同一个对象
    Method method ： 对接口中的方法进行封装的 method 对象
    Object[] args ： 调用方法的实际参数
    返回值 Object，若代理的方法返回为空，返回null
*/
public Object invoke(Object proxy, Method method, Object[] args)
    throws Throwable;
~~~

jdk 代理工厂
~~~java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class ProxyFactory {
    TrainStation trainStation=new TrainStation();
    public SellTickets getProxyObject(){
        /*
            ClassLoader loader : 类加载器，用于加载代理类，可以通过目标对象获取
            Class<?>[] interfaces ： 代理类实现的接口的字节码对象
            InvocationHandler h ： 代理对象的调用处理程序
         */
        SellTickets proxyObject = (SellTickets)Proxy.newProxyInstance(
                trainStation.getClass().getClassLoader(),
                trainStation.getClass().getInterfaces(),
                /*
                    匿名内部类，重写抽象方法
                    Object proxy ： 代理对象，和proxyObject对象是同一个对象
                    Method method ： 对接口中的方法进行封装的 method 对象
                    Object[] args ： 调用方法的实际参数
                    返回值为方法的返回值
                 */
                new InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        //对方法进行增强
                        System.out.println("jdk动态代理替顾客去火车站买票");
                        //执行目标对象的方法
                        Object obj = method.invoke(trainStation, args);
                        System.out.println("jdk动态代理代售点替顾客买了票");
                        return obj; //null
                    }
                }
        );

        return proxyObject;

    }
}
~~~

反编译后得到的代理类如下（删除了 equals, toString, hashcode 方法）
~~~java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.lang.reflect.UndeclaredThrowableException;
import jdkproxy.SellTickets;

public final class $Proxy0
        extends Proxy
        implements SellTickets {
    private static Method m3;

    public $Proxy0(InvocationHandler invocationHandler) {
        super(invocationHandler);
    }

    static {
        try {
            m3 = Class.forName("jdkproxy.SellTickets").getMethod("sell", new Class[0]);
            return;
        }
        catch (NoSuchMethodException noSuchMethodException) {
            throw new NoSuchMethodError(noSuchMethodException.getMessage());
        }
        catch (ClassNotFoundException classNotFoundException) {
            throw new NoClassDefFoundError(classNotFoundException.getMessage());
        }
    }


    public final void sell() {
        try {
            this.h.invoke(this, m3, null);
            return;
        }
        catch (Error | RuntimeException throwable) {
            throw throwable;
        }
        catch (Throwable throwable) {
            throw new UndeclaredThrowableException(throwable);
        }
    }
}
~~~

测试类
~~~java
public class Client {
    public static void main(String[] args) {
        // 1. 创建代理工厂对象
        ProxyFactory factory=new ProxyFactory();
        // 2. 获取代理对象
        SellTickets proxyObject = factory.getProxyObject();
        // 3. 调用代理对象的方法
        proxyObject.sell();

        Class<? extends SellTickets> clazz = proxyObject.getClass();
        System.out.println(clazz);
        while(true){}
    }
}
~~~

实现过程：调用代理对象的 sell 方法，代理类调用了 InvocationHandler 的实现类的 invoke 方法， invoke 方法通过反射执行真实对象 TraiStation 中的 sell 方法。

### CGLib 代理

如果前面的例子没有定义 SellTickets 接口，只定义了 TrainStation 实现类，则无法使用 JDK 动态代理，因为 JDK 动态代理是对接口进行代理。

CGLib 是一个功能强大高性能的代码生成包，为没有实现接口的类提供代理

现在真实主题不需要实现接口了
~~~java
public class TrainStation {
    public void sell() {
        System.out.println("火车站卖票");
    }
}
~~~

创建 Enhancer 对象，类似 JDK 代理的 Proxy 类。设置父类的字节码对象，返回的是它或它的子类。设置回调函数，传入this，因为工厂类继承了MethodInterceptor，实现了intercept方法，通过代理对象调用 sell 方法实际执行的是 intercept 方法。
~~~java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class ProxyFactory implements MethodInterceptor {
    TrainStation trainStation=new TrainStation();

    public TrainStation getProxyObject(){
        // 创建 Enhancer 对象
        Enhancer enhancer=new Enhancer();
        // 设置父类的字节码对象
        enhancer.setSuperclass(TrainStation.class);
        // 设置回调函数
        enhancer.setCallback(this);
        // 创建代理对象
        TrainStation proxyObject=(TrainStation) enhancer.create();
        return proxyObject;

    }

    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        //对方法进行增强
        System.out.println("cglib动态代理替顾客去火车站买票");
        Object obj = method.invoke(trainStation, objects);
        System.out.println("cglib动态代理代售点替顾客买了票");
        return obj;
    }
}
~~~

测试类
~~~java
public class Client {
    public static void main(String[] args) {
        ProxyFactory proxyFactory=new ProxyFactory();
        TrainStation proxyObject = proxyFactory.getProxyObject();
        proxyObject.sell();
    }
}
~~~

---

### 三种代理对比

cglib 底层使用 ASM 字节码