---
title: 集合框架
sidebar_position: 1
---

### Collection

Java 提供了很多数据结构的接口和实现类（动态数组，链表，树，哈希表，集合，键值对），以便我们使用这些现成的代码快速开发。集合框架把这些接口和实现类通过面向对象的方式集合起来。

Collection 接口继承 Iterable 接口，其它的集合框架接口继承 Collection 接口。

```java
interface Collection<E> extends Iterable<E> 
```

### Map

Map 储存一组键值，提供健到值的快速映射。

Map 底层将数据以 `interface Entry<K, V>` 的形式储存

常用方法：

```java
int size(); //获取键值对数量
boolean isEmpty(); //是否为空
boolean containsKey(Object key); //是否含有某个 key
V get(Object key); //获取 key 对应的值
V put(K key, V value); //插入，若存在则更新值
V remove(Object key); //移除 key 和它对应的 value
void putAll(Map<? extends K, ? extends V> m); //插入所有
Set<K> keySet(); //获取所有 key 的集合
Collection<V> values(); //获取所有值的集合
Set<Map.Entry<K, V>> entrySet(); //获取所有 Map.Entry 的集合
```

实现类：

TreeMap

TreeMap 底层是红黑树，查找和插入时间复杂度为 o(log n) 

TreeMap 实现 NavigableMap 接口，间接实现 SortedMap 接口。由于是树结构，所以是有序的

TreeMap 有很多实用的方法，获取大于或小于当前 key 的 key 或 entry

```java
public final Map.Entry<K,V> ceilingEntry(K key)
public final K ceilingKey(K key) 
public final Map.Entry<K,V> higherEntry(K key)
public final K higherKey(K key) 
public final Map.Entry<K,V> floorEntry(K key)
public final K floorKey(K key) 
public final Map.Entry<K,V> lowerEntry(K key) 
public final K lowerKey(K key) 
public final K firstKey() 
public final K lastKey() 
```