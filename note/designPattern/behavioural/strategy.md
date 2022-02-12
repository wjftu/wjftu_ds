# 策略模式

定义一些列算法，把算法封装起来，使他们可以相互替换

角色：

* 抽象策略（strategy）类：定义所有策略类所需实现的通用接口
* 具体策略（concrete strategy）类：具体实现一个算法
* 内容类（Context）：慈幼策略类的引用，给客户端调用

抽象策略类

```java
public abstract class Strategy {
    public void showStrategy(){}
}
```

具体策略类

```java
public class ConcreteStrategyA extends Strategy {
    @Override
    public void showStrategy() {
        System.out.println("ConcreteStrategyA");
    }
}

public class ConcreteStrategyB extends Strategy {
    @Override
    public void showStrategy() {
        System.out.println("ConcreteStrategyB");
    }
}
```

内容类

```java
public class StrategyClient {
    Strategy strategy;

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public void exec(){
        strategy.showStrategy();
    }
}
```

通过策略模式，可以在多个策略之间自由切换，且易于扩展，扩展只需添加一个新的策略类，不需要改变原有代码。体现了面向对象设计思想。缺点是产生很多策略类。