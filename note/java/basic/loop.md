---
title: 循环
sidebar_position: 4
---


### for 循环

```java
for(初始化; 布尔表达式; 更新) {
    //循环体
}
```

例如
```java
for(int i=0;i<10;++i){
    System.out.println(i);
}

//双重 for 循环
for(int i=0;i<10;++i){
    for(int j=5;j>0;--j){
        System.out.println(j);
    }
}
```

for 循环初始化的变量在循环外不可访问，也不可和循环外的变量名相同，以免混淆。如果不满足条件，循环一次都不会执行。

初始化、布尔表达式、更新，都可以为空，但分号必须有。
```java
int index=0;
for(;;){
    index++;
    if(index=4) break;
}
```

可以用 `continue` 跳过下面未执行的语句，继续循环。也可以用 `break` 跳出循环，如果是多重循环，可以给循环命名，否则会对当前循环生效。
```java
outter:for(int i=0;i<10;++i){
    inner:for(int j=5;j>0;--j){
        if(j==5) continue inner; //same with continue;
        if(j==3) break outter;
    }
}
```

### while 循环

```java
while( 布尔表达式 ) {
  //循环体
}
```

例如
```java
int i=0
while(i<7){
    System.out.println(i);
    ++i;
}
```

与 for 循环类似，也可以用 continue 和 break 语句


```java
int i=0
while(i<7){
    if(i==3) continue;
    System.out.println(i);
    if(i==5) break;
}
```

while 循环如果不满足条件，一次都不会执行。如果使用 do-while 循环，至少会执行一次。
```java
int i=0
int index=0;
do{
    ++i;
    ++index;
}while(index<5)
System.out.println(i); //5
```

### Iterator 迭代器

对于实现 Iterable 接口的类（如 Collection），可以使用迭代器循环

```java
List<String> list;
Iterator<String> it = list.iterator();
while(it.hasNext()){
    //
}
```

### for each 循环

对于数组和 List ，可以使用 for each 循环，代码更美观

```java
int[] arr={1,2,3};
for(int i:arr){
    System.out.println(i);
}
List list=Arrays.asList(arr);
for(int i:list){
    System.out.println(i);
}
```

for each 循环底层使用的是 Iterator ，使用集合框架的时候，不要在 for each 循环时使用 add 和 remove ，会报错。可以显式使用 Iterator ，并使用 Iterator 的 remove 方法。