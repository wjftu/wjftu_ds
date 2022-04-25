---
title: 数组
sidebar_position: 3
---



Java 的数组可以是基本类型，也可以是对象。基本类型在数组中储存的是值，而对象是指针。数组顺序排列，查找某个元素的时间位 O(1) 。和大多数语言一样，java 的数组从 0 开始。使用 `[n]` 访问数组元素，如果超过下标，会抛出 ArrayIndexOutOfBoundsException 异常而终止程序。

### 声明与初始化

```java
int[] a; //声明一个 int 数组
double b[]; //声明一个 double 数组，c++ 风格，不推荐
a=new int[5]; //创建一个长度为 5 的数组，基本类型元素初始化为默认值
Integer[] c=new Integer[10]; //创建一个长度为 10 的数组，引用类型初始化为 null
int[] d=new int[]{7,0,9}; //创建一个长度为 3 的数组，并将元素初始化为7，0，9
int[] d={7,0,9}; //等价写法
int e=d[2] //e==9
```



二维数组，第一维是指向数组的指针。二维数组和矩阵不一样，因为它可以是参差不齐的。


```java
//初始化一个 3x4 的二维数组
int[][] a=new int[3][];
a[0]=new int[4];
a[1]=new int[4];
a[2]=new int[4];
//等价方法
int[][] b=new int[3][4];
```

### 数组类

数组是一个类，虽然创建数组的语法稍微特殊。

成员变量 

```java
public int length; //数组的长度
```

常用方法

```java
String toString() //打印数组内存地址，非每个元素
void clone() //复制数组
stream() //生成流
```


### 工具类

Arrays 是一个与数组相关的工具类，提供大量静态方法，实现常见的操作。

```java
void sort() //排序，基本类型使用快速排序，对象使用归并排序
String toString() //打印出字符串，打印每个元素而不是数组的地址
int binarySearch(int[] a, int key) //二分查找，有各种类型的版本
List<T> asList(T... a) //转换为长度固定的 List
int[] copyOf(int[] original, int newLength) //复制，有各种类型的版本，速度快
```