---
title: 工厂模式
sidebar_position: 2
---

# 工厂模式

如果创建对象使用 new ，那么以后要更改创建的对象，所有 new 的地方都要改，耦合严重。



### 简单工厂模式

简单工厂模式不是23种设计模式种的，更像一种编程习惯。

简单工厂模式包含：

* 抽象产品：定义产品规范，描述产品主要特性和功能
* 具体产品：抽象产品的具体实现
* 具体工厂：提供创建产品的方法



设计一个咖啡店

抽象产品：

~~~java title="抽象产品"
//抽象产品，定义产品的特性和功能
public abstract class Coffee {

    public abstract String getName();

    public void addSugar(){
        System.out.println("add sugar");
    }

    public void addMilk(){
        System.out.println("add milk");
    }
}
~~~



2个具体产品：

~~~java
public class LatteCoffee extends Coffee {
    @Override
    public String getName() {
        return "Latte Coffee";
    }
}
~~~

~~~java
public class AmericanCoffee extends Coffee {
    @Override
    public String getName() {
        return "American Coffie";
    }
}
~~~

工厂类：
~~~java
//简单咖啡工厂，在这里new对象
public class SimpleCoffeeFactory {

    public Coffee createCoffee(String name){
        Coffee coffee=null;
        if("american".equals(name)){
            coffee=new AmericanCoffee();
        } else if("latte".equals(name)){
            coffee=new LatteCoffee();
        } else {
            throw new RuntimeException("Not Support");
        }
        return coffee;
    }
}
~~~


咖啡店，不直接 new 对象，使用工厂来创造对象，实现与产品的解耦
~~~java
public class CoffeeStore {

    public Coffee orderCoffee(String name){
        //通过工厂创建，解除了具体产品的依赖
        SimpleCoffeeFactory factory=new SimpleCoffeeFactory();
        Coffee coffee=factory.createCoffee(name);
        coffee.addMilk();
        coffee.addSugar();
        return coffee;
    }
}
~~~

* 优点：  
封装了船舰对象的过程，通过参数获取对象，把对象创建和业务逻辑层分开。如果要增加产品只需要修改工厂类。

* 缺点：  
增加产品时需要修改工厂类，违背了开闭原则。

---

扩展：

也可以使用静态工厂模式，将方法设置为静态

~~~java
public class SimpleCoffeeFactory {

    public static Coffee createCoffee(String name){
        Coffee coffee=null;
        if("american".equals(name)){
            coffee=new AmericanCoffee();
        } else if("latte".equals(name)){
            coffee=new LatteCoffee();
        } else {
            throw new RuntimeException("Not Support");
        }
        return coffee;
    }
}
~~~

创建咖啡对象无需创建工厂对象
~~~java
Coffee coffee=SimpleCoffeeFactory.createCoffee(name);
~~~



### 工厂方法模式

定义一个创建工厂的接口，让子类决定具体如何实例化对象。工厂方法模式使一个产品的实例化延迟到其工厂的子类。

工厂方法模式的角色：
* 抽象工厂（Abstract Factory）：提供创建产品的接口
* 具体工厂（Concrete Factory）：实现抽象工厂，完成具体产品创建
* 抽象产品（Product）：定义产品规范，描述产品特性和同能
* 具体产品（Concrete Product）：实现抽象产品，由具体工厂创建，与工厂一一对应

原有的 Coffee 抽象产品类和美式咖啡、拿铁咖啡具体产品不变，定义一个抽象工厂：

~~~java
public interface CoffeeFactory {
    public Coffee createCoffee();
}
~~~

工厂实现类（具体工厂）：
~~~java
public class AmericanCoffeeFactory implements CoffeeFactory {
    @Override
    public Coffee createCoffee() {
        return new AmericanCoffee();
    }
}
~~~


~~~java
public class LatteCoffeeFactory implements CoffeeFactory {
    @Override
    public Coffee createCoffee() {
        return new LatteCoffee();
    }
}
~~~

咖啡店类
~~~java
public class CoffeeStore {
    CoffeeFactory factory;

    public Coffee createCoffee(){
        Coffee coffee=factory.createCoffee();
        coffee.addMilk();
        coffee.addSugar();
        return coffee;
    }

    public void setFactory(CoffeeFactory factory) {
        this.factory = factory;
    }
}
~~~

测试类：
~~~java
public class Client {
    public static void main(String[] args) {
        CoffeeStore store=new CoffeeStore();
        CoffeeFactory factory=new AmericanCoffeeFactory();
        store.setFactory(factory);
        Coffee coffee=store.createCoffee();
        System.out.println(coffee.getName());
    }
}
~~~

* 优点：  
用户只需要知道具体工厂名称就可以生产产品，无需知道产品的创建过程  
增加新产品秩序添加具体产品类和具体工厂类，无需对原有工厂修改，满足开闭原则

* 缺点：  
每增加一个具体产品就需要增加一个工厂，增加系统复杂度

### 抽象工厂模式

简单工厂模式只能生产同等级的产品，但现实生活种许多工厂是混合型工厂，例如电器厂生产电视机又生产洗衣机。例如苹果公司生产苹果手机、苹果电脑。联想公司生产联想手机、联想电脑。苹果电脑和苹果手机是一个产品族，苹果电脑和联想电脑是一个产品等级。抽象工厂模式考虑同一个产品族不同等级产品的生产。

抽象工厂的角色和工厂方法一样，只是抽象产品等级更多了。

例如咖啡店除了生产咖啡，还要生产点点：提拉米苏、抹茶慕斯。如果定义提拉米苏工厂类、抹茶慕斯工厂类，甜点工厂类，容易发生类爆炸。拿铁咖啡和美式咖啡是一个产品等级，都是咖啡，提拉米苏和抹茶慕斯死一个产品等级，都是甜点。美式咖啡和抹茶慕斯是一个产品族（美式风味），拿铁咖啡和提拉米苏是一个产品族（意式风味）。

原有的咖啡产品不变，现在创造两个工厂，一个美式甜品工厂，一个意式甜品工厂。


定义新的抽象产品：甜品
~~~java
public abstract class Dessert {
    public abstract void show();
}
~~~

两个具体产品

~~~java
public class MatchaMousse extends Dessert {
    @Override
    public void show() {
        System.out.println("matcha mousse");
    }
}
~~~

~~~java
public class Trimisu extends Dessert {
    @Override
    public void show(){
        System.out.println("trimisu");
    }
}
~~~



定义抽象工厂
~~~java
public interface DessertFactory {
    //生产咖啡功能
    Coffee createCoffee();
    //生产甜品功能
    Dessert createDessert();
}
~~~

2个具体工厂：
~~~java
public class ItalyDessertFactory implements DessertFactory {
    @Override
    public Coffee createCoffee() {
        return new LatteCoffee();
    }
    @Override
    public Dessert createDessert() {
        return new Trimisu();
    }
}
~~~


~~~java
public class AmericanDessertFactory implements DessertFactory {
    @Override
    public Coffee createCoffee() {
        return new AmericanCoffee();
    }
    @Override
    public Dessert createDessert() {
        return new MatchaMousse();
    }
}

~~~

* 优点  
一个产品族多个对象设计成一起工作时，保证客户端始终只用一个产品族的对象。
* 缺点  
需要增加新的产品时，所有工厂类都要修改

使用场景：  
* 需要创建一系列相关互相依赖的产品
* 系统有多个产品族，每次只用一族产品
* 系统提供产品类库，所有产品接口相同，客户端不依赖产品细节和内部结构

如：输入法皮肤，一整套一起换。

### 模式扩展

简单工厂+配置文件接触耦合

可以通过工厂模式+配置文件的方式接触工厂对象和产品对象的耦合，工厂类加载配置文件的全类名，创建对象进行储存，客户端需要对象直接获取即可

抽象产品和两种咖啡具体实现不变，创建一个配置文件 bean.properties，配置全类名

~~~properties
american=configfactory.AmericanCoffee
latte=configfactory.LatteCoffee
~~~

根据配置文件反射创建产品的咖啡工厂
~~~java
package configfactory;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Properties;
import java.util.Set;

public class CoffeeFactory {

    private static HashMap<String,Coffee> map=new HashMap<>();

    static{
        //创建 properties 对象
        Properties p=new Properties();
        // properties 对象的 load 方法进行配置文件加载
        InputStream is = CoffeeFactory.class.getClassLoader().getResourceAsStream("bean.properties");
        try {
            p.load(is);
            //获取全类名并创建对象
            Set<Object> keys = p.keySet();
            for(Object key:keys){
                String className=p.getProperty((String) key);
                //反射创建对象
                Class clazz=Class.forName(className);
                Coffee coffee = (Coffee)clazz.newInstance();
                //存储到容器
                map.put((String) key, coffee);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Coffee createCoffee(String name){
        return map.get(name);
    }
}
~~~

测试类

~~~java
package configfactory;

public class Client {
    public static void main(String[] args) {
        Coffee coffee = CoffeeFactory.createCoffee("american");
        System.out.println(coffee.getName());
        Coffee coffee2 = CoffeeFactory.createCoffee("latte");
        System.out.println(coffee2.getName());
    }
}
~~~

扩展性更好且符合开闭原则

### JDK 中的抽象工厂模式

抽象工厂
~~~java
public interface Collection<E> extends Iterable<E> {
	Iterator<E> iterator();
}
~~~

抽象产品
~~~java
public interface Iterator<E> {
	boolean hasNext();
	E next();
}
~~~

具体工厂，ArrayList 私有的成员内部类
~~~java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable{
    public Iterator<E> iterator() {
        return new Itr();
    } 
}
~~~

具体产品
~~~java
private class Itr implements Iterator<E> {
    int cursor;       // index of next element to return
    int lastRet = -1; // index of last element returned; -1 if no such
    int expectedModCount = modCount;

    Itr() {}

    public boolean hasNext() {
    return cursor != size;
    }
    //...
}
~~~






