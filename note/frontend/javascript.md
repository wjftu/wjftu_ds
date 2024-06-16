---
title: JavaScript
sidebar_position: 1
---


ECMAScript 是一种脚本语言规范，JavaScript 是实现规范的语言

### 变量

可以通过 let 声明变量，变量可以是 number string object boolean 等等，可以用 `typeof` 查看变量类型。

```js
// number
let a = 13
let b = 1.2
// string
let c = "abc"
// object
let d = {
    name: "jeff",
    age: 12
}
// boolean
let e = true
```

常量用 const 声明，常量不可以重新赋值

```js
const PI = 3.14
```

### 函数

通过 function 定义函数

```js
function hello() {
    console.log("hello sir")
}

function sayHello(name) {
    console.log("hello", name)
}
```

优雅的箭头函数

```js
let hello = () => {
    console.log("hello sir")
}

let sayHello = (name) => {
    console.log("hello", name)
}
```

有返回值的函数

```js
let add = (a, b) => {
    return a + b
}

// 隐式返回
let add2 = (a, b) => a + b
```

参数可以有默认值

```js
let sayHello = (name = "john") => {
    console.log("hello", name)
}
```

### 数组

声明数组

```js
// 声明空数组，长度为 0 
let a1 = []
// 声明指定长度的数组，元素为 undefined
let a2 = new Array(3)
// 声明并初始化数组元素
let a3 = [1, "tom", true]
```

可以用 push 和 pop 在尾部添加或弹出元素，可以用 unshift 和 shift 在头部添加或弹出元素

```js
let arr = [1,2,3]
arr.push(4)
// [ 1, 2, 3, 4 ]
arr.pop()
// [ 1, 2, 3 ]
arr.unshift(0)
// [ 0, 1, 2, 3 ]
arr.shift()
// [ 1, 2, 3 ]
```

splice 方法可以删除元素，第一个变量为其实索引，第二个变量为删除元素的个数

```js
let arr1 = [1,2,3,4,5]
let arr2 = arr1.splice(2,1)
// arr1: [ 1, 2, 4, 5 ]
// arr2: [ 3 ]
```

排序

注意 number 排序需要手动传入判断大小的方法，否则就是字符串排序

```js
let arr1 = ["bob", "david", "carol", "alice"]
let arr2 = [4,1,15,2,3]
let arr3 = [4,1,15,2,3]
arr1.sort()
arr2.sort()
arr3.sort((a, b) => a - b)

// arr1 [ 'alice', 'bob', 'carol', 'david' ]
// arr2 [ 1, 15, 2, 3, 4 ]
// arr3 [ 1, 2, 3, 4, 15 ]
```

遍历数组

```js
let names = ["alice", "bob", "caleb"]
for(let name of names) {
    console.log(name)
}

for(let i=0; i<names.length; i++) {
    console.log(names[i])
}

names.forEach((name) => {
    console.log(name)
})
```

filter 方法可以根据条件过滤并生成新的数组

```js
let names = ["alice", "bob", "caleb"]
let arr = names.filter((name) => {
    return name.length > 3
})
// [ 'alice', 'caleb' ]
```

展开数组

```js
let arr = [1,3,2]
let arr2 = [...arr]
// arr2: [ 1, 3, 2 ]
```




### 集合框架

Map

set 方法设置键值对，会覆盖原有的  

has 方法判断是否存在某个键  

delete 方法删除键值对  

clear 方法清除所有键值对  

```js
let mp = new Map()
mp.set("k1", "v1")
mp.has("k1")
mp.delete("k1")
mp.clear()
```

创建并初始化 Map


```js
let mp = new Map([
    ["k1", "v1"],
    ["k2", 2]
])
```

遍历 Map

```js
let mp = new Map([
    ["name", "jeff"],
    ["age", 1]
])

for(let entry of mp) {
    console.log(entry)
}
// [ 'name', 'jeff' ]
// [ 'age', 1 ]

for(let [key, value] of mp) {
    console.log(key, value)
}
// name jeff
// age 1

mp.forEach((value, key) => {
    console.log(key, value)
})
// name jeff
// age 1
```

Set

has 方法判断是否元素存在

delete 方法删除元素，元素存在返回 true ，否则返回 false

add 方法添加元素，并返回 set

```js
let st = new Set(["apple", "banana"])
// Set(2) { 'apple', 'banana' }
let b = st.has("apple") // true

// Set(3) { 'apple', 'banana', 'coconut' }
st.delete("apple")
// Set(2) { 'banana', 'coconut' }
```

Set 转为数组

```js
let st = new Set(["apple", "banana", "coconut"])
let arr = Array.from(st)
```

遍历

```js
let names = ["jim", "merry", "alice"]

for(let name of names) {
    console.log(name)
}

names.forEach(name => {
    console.log(name)
})
```

### 对象

创建一个简单对象

```js
let people = {
    name: "jeff",
    age: 1
}
```

可以通过点或者中括号获取和修改属性，可以通过 in 判断是否存在某个属性

```js
people.age = 2
people["name"] = "jim"
people["job"] = "typist"
// { name: 'jim', age: 2, job: 'typist' }
console.log(age in people ) //true
```









