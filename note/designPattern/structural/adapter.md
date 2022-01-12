# 适配器模式

适配器模式包含：

* 目标（target）接口：当前系统业务所期待的接口，可以是接口或抽象类
* 适配者（adaptee）类：被访问和适配的现存组件
* 适配器（adapter）类：转换器，通过引用或启程适配者对象，把适配者接口转换为目标接口

有一个 TF 卡接口

```java
public interface TFCard {
    public void readTFData();
}
```

以及一个 TF 卡实现类，可以读取数据

```java
public class TFCardImpl implements TFCard {
    public void readTFData() {
        System.out.println("read data from tf card");
    }
}
```

还有一个 SD 卡接口，也有读取数据的功能

```java
public interface SDCard {
    public void readSDData();
}
```

适配器类

```java
public class TFCardAdapter implements SDCard {

    TFCard tfCard;

    public TFCardAdapter(TFCard tfCard){
        this.tfCard=tfCard;
    }

    public void readSDData() {
        tfCard.readTFData();
    }
}
```

客户端只能读取 SD 卡，但通过适配器，可以读取 TF 卡

```java
public class AdapterClient {
    public static void main(String[] args) {
        TFCard tfCard = new TFCardImpl();
        SDCard sdCard = new TFCardAdapter(tfCard);
        sdCard.readSDData();
    }
}
```


