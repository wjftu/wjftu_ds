---
title: 基本类型
sidebar_position: 1
---


Java 共有 8 种基本类型

| 类型    | bit  | 默认值   | 封装类    | 范围                               |
| ------- | ---- | -------- | --------- | ---------------------------------- |
| byte    | 8    | (byte)0  | Byte      | -128~127                           |
| short   | 16   | (short)0 | Short     | -32768 ~ 32767                     |
| int     | 32   | 0        | Integer   | -2,147,483,648‬ ~ 2,147,483,6487    |
| long    | 64   | 0L       | Long      | -2<sup>63</sup> ~ 2<sup>63</sup>-1 |
| float   | 32   | 0.0f     | Float     | IEEE754                            |
| double  | 64   | 0.0      | Double    | IEEE754                            |
| char    | 16   | '\u0000' | Charactor | '\u0000' ~ '\uffff'                |
| boolean | ~    | false    | Boolean   | true false                         |

Java 变量长度是确定好的（除了boolean），不会因为编译器而改变，也没有 sizeof() 方法。可以通过包装类的 `SIZE` 变量获取类型的 size ，例如 `Integer.SIZE=32`。

### 自动装箱



从 Java SE 5 开始，基本类型可以自动装箱，因此可以这样写：

```java
Character c1='c';
char c2=c1;
int i1=12;
Integer i2=i1+1;
```

自动装箱是用了包装类的 `valueOf()`方法

```java
Integer i1=Integer.valueOf(33);
```



### 类型转换

低级的变量可以隐式转换成高级的变量（向上转型）

```java
byte b=12;
short s=b;
int i=s;
long l=i;

float f=1.1f;
double d=f;
```

但是不可以隐式地转为低级变量（向下转型），因为会损失精度。只能通过强制类型转换，不然会报错。

```java
long l=58;
int i=(int)l;
short s=(short)i;
byte b=(byte)s;

double d=5.3;
float f=(float)d;
```

