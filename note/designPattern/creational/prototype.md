---
title: 原型模式
sidebar_position: 3
---

# 原型模式

当创建对象复杂的时候，可以使用原型方式快捷创建对象，通过使用原型来克隆。

原型模式包括：

* 抽象原型类：规定了具体原型类必须实现的 clone() 抽象方法
* 具体原型类：继承抽象原型类，实现 clone() 方法，是可被复制的对象
* 访问类：使用具体原型类的 clone() 方法复制新对象

克隆分为深克隆和浅克隆。浅克隆创建新对象，成员和原来的对象完全相同，对于非基本类型的成员，指向原有对象内存地址。深克隆的引用对象也会被克隆，不会指向原有对象的地址。

Java 种 Object 类提供了 clone() 方法实现浅克隆。

抽象原型类

```java
public abstract class Prototype implements Cloneable {

    public Prototype clone() throws CloneNotSupportedException {
        return (Prototype) super.clone();
    }

}
```

具体原型类

```java
public class ConcretePrototype1 extends Prototype {
    @Override
    public ConcretePrototype1 clone() throws CloneNotSupportedException {
        return (ConcretePrototype1)super.clone();
    }
}
```

具体原型类也可以直接实现 Cloneable 接口

```java
public class ConcretePrototype2 implements Cloneable {

    @Override
    public ConcretePrototype2 clone() throws CloneNotSupportedException {
        return (ConcretePrototype2) super.clone();
    }
}
```

测试类

```java
public class TestPrototype {
    public static void main(String[] args) throws CloneNotSupportedException {

        ConcretePrototype1 c1 = new ConcretePrototype1();
        ConcretePrototype1 c2 = c1.clone();
        System.out.println(c1==c2); //false
    }
}
```


扩展：实现深克隆

```java
public class ConcretePrototype1 extends Prototype {

    Date date;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Override
    public ConcretePrototype1 clone() throws CloneNotSupportedException {
        return (ConcretePrototype1)super.clone();
    }

    @Override
    public String toString() {
        return "ConcretePrototype1{" +
                "date=" + date +
                '}';
    }
}
```

测试类。改变克隆对象的成员，原型的成员也改变，因为引用的是同一个对象。

```java
public class TestPrototype {
    public static void main(String[] args) throws CloneNotSupportedException {

        ConcretePrototype1 c1 = new ConcretePrototype1();
        c1.setDate(new Date());
        ConcretePrototype1 c2 = c1.clone();
        c2.getDate().setTime(111);
        System.out.println("c1==c2? "+ (c1==c2));
        System.out.println("c1: "+c1);
        System.out.println("c2: "+c2);
    }
}
/*
输出：
c1: ConcretePrototype1{date=Sat Feb 12 22:20:49 CST 2022}
c1==c2? false
c1: ConcretePrototype1{date=Thu Jan 01 08:00:00 CST 1970}
c2: ConcretePrototype1{date=Thu Jan 01 08:00:00 CST 1970}
*/
```

ConcretePrototype1 实现序列号接口

```java
public class ConcretePrototype1 extends Prototype implements Serializable {
    //...
}
```

深克隆。这样 Date 成员就是一个新的对象

```java
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("object.txt"));
oos.writeObject(c1);
oos.close();

ObjectInputStream ois = new ObjectInputStream(new FileInputStream("object.txt"));
ConcretePrototype1 c3 = (ConcretePrototype1) ois.readObject();
```

