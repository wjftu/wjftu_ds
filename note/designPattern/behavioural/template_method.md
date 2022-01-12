# 模板方法模式

有时设计一个系统时已经直到了算法所需的关键步骤，而且确定了关键步骤的执行顺序，但步骤的具体实现未知。

例如银行办理业务的流程：取号、排队、办理具体业务。取号和排队对于每个顾客是一样的，办理具体业务因人而异。

角色：  
* 抽象类（Abstract Class）：负责给出算法的轮廓和股价，由一个模板方法和若干基本方法构成
    * 模板方法：定义算法骨架，按某种顺序调用其包含的基本方法  
    * 基本方法：实现算法的各个步骤的方法，是模板方法的组成部分：  
        * 抽象方法（Abstract Method）：由抽象类声明，子类实现
        * 具体方法（Concrete Method）：在抽象类或具体类中声明并实现
        * 钩子方法（Hook Method）：抽象类中已经实现，包括用于判断的逻辑方法和需要子类重写的同方法，一般返回值为 boolean


以炒菜为例

抽象类，定义模板方法和基本方法

~~~java
/*
 * 抽象类
 * 定义模板方法和基本方法
 */
public abstract class AbstractClass {

    //模板方法
    public final void cookProcess(){
        pourOil();
        addVegetable();
        addSauce();
        fry();
    }

    //抽象方法和具体方法
    public void pourOil(){
        System.out.println("倒油");
    }

    public abstract void addVegetable();

    public abstract void addSauce();

    public void fry(){
        System.out.println("炒菜");
    }
}
~~~

两种实现：
~~~java
public class ConcreteClass_Carrot extends AbstractClass {
    public void addVegetable() {
        System.out.println("加入萝卜");
    }

    public void addSauce() {
        System.out.println("加盐加味精");
    }
}
~~~

~~~java
public class ConcreteClass_Tomato extends AbstractClass {
    public void addVegetable() {
        System.out.println("加入番茄");
    }

    public void addSauce() {
        System.out.println("加入盐");
    }
}
~~~

测试类

~~~java
public class Client {
    public static void main(String[] args) {
        ConcreteClass_Carrot carrot=new ConcreteClass_Carrot();
        carrot.cookProcess();
        ConcreteClass_Tomato tomato=new ConcreteClass_Tomato();
        tomato.cookProcess();
    }
}
~~~

### 优缺点

优点：  
* 提高代码复用性，相同代码放在父类中
* 实现反向控制，通过父类调用子类的操作，通过子类具体实现扩展不同行为

缺点：  
* 对每一个实现需要重新定义子类，导致类的个数增加
* 父类抽象方法由子类实现，子类执行结果影响父类的结果，导致阅读代码难度增加

使用场景：  
* 算法整体步骤固定，个别步骤易变。
* 需要通过子类决定父类某个方法是否执行，实现子类对父类反向控制（通过钩子函数）


### JDK 中的模板方法模式

~~~java
public abstract class InputStream implements closeable{

    //抽象方法，子类需重写
    public abstract int read() throws IOException;

    public int read(byte b[], int off, int len) throws IOException {
            if (b == null) {
                throw new NullPointerException();
            } else if (off < 0 || len < 0 || len > b.length - off) {
                throw new IndexOutOfBoundsException();
            } else if (len == 0) {
                return 0;
            }

            int c = read(); //read 方法由子类实现
            if (c == -1) {
                return -1;
            }
            b[off] = (byte)c;

            int i = 1;
            try {
                for (; i < len ; i++) {
                    c = read();
                    if (c == -1) {
                        break;
                    }
                    b[off + i] = (byte)c;
                }
            } catch (IOException ee) {
            }
            return i;
        }
    }
}
~~~