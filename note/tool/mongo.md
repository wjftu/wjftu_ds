---
title: Mongo DB
sidebar_position: 31
---

# Mongo DB

开源 NoSQL ，文档型数据库，以 Json 的文档模型储存数据，非常灵活，底层采用 bson 节约空间。

官网：https://www.mongodb.com

社区版下载：https://www.mongodb.com/try/download/community

命令行客户端 Mongo Shell：https://www.mongodb.com/try/download/shell

启动 MongoDB

运行 bin 下的 mongod 

```
mongod --dbpath /path/to/dbdata
mongod --dbpath /Users/mac/Documents/app/mongodb-macos-x86_64-7.0.14/data
```

### 使用 MongoDB Shell 进行增删改查

文档：https://www.mongodb.com/zh-cn/docs/manual/reference/  

运行 mongo shell ，运行 bin 文件夹下的

```
mongosh
```



MongoDB 的 collection 为数据表/数据集合，相当于 SQL 的 table。 document 文档，相当于 row。 field 数据字段，相当于 column

use 命令可以使用 database，如果不存在则创建
```
test> use item
switched to db item
item>
```

insertOne 可以向 collection 中插入一条数据，MongoDB 会自动生成 primary key

```
item> db.items.insertOne({"id": 1, "price": 1.2, "quantity": 1})
{
  acknowledged: true,
  insertedId: ObjectId('66e170966a1879410cf28448')
}
```

也可先赋值给变量，再插入变量，下同

```
item> var item2 = {"id": 2, "price": 9.9, "quantity": 12}

item> db.items.insertOne(item2)
{
  acknowledged: true,
  insertedId: ObjectId('66e1711c6a1879410cf28449')
}
```

insertMany 可以向 collection 中插入一条数据，MongoDB 会自动生成 primary key

```
item> db.items.insertMany([{"id": 3, "price": 10, "quantity": 34},{"id": 4, "price": 8.0, "quantity": 3}])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('66e171866a1879410cf2844a'),
    '1': ObjectId('66e171866a1879410cf2844b')
  }
}
```

find 方法可以查找最多 20 条数据

```
item> db.items.find()
[
  {
    _id: ObjectId('66e170966a1879410cf28448'),
    id: 1,
    price: 1.2,
    quantity: 1
  },
  {
    _id: ObjectId('66e1711c6a1879410cf28449'),
    id: 2,
    price: 9.9,
    quantity: 12
  },
  {
    _id: ObjectId('66e171866a1879410cf2844a'),
    id: 3,
    price: 10,
    quantity: 34
  },
  {
    _id: ObjectId('66e171866a1879410cf2844b'),
    id: 4,
    price: 8,
    quantity: 3
  }
]
```

find 传入一个对象，可以进行过滤

```
item> db.items.find({"price":8})
[
  {
    _id: ObjectId('66e171866a1879410cf2844b'),
    id: 4,
    price: 8,
    quantity: 3
  }
]
```

findOne 查找单条数据，即使有多条也只返回 1 条

`_id` 作为 key ，可以不用引号

```
item> db.items.findOne({_id: ObjectId('66e171866a1879410cf2844b')})
[
  {
    _id: ObjectId('66e171866a1879410cf2844b'),
    id: 4,
    price: 8,
    quantity: 3
  }
]
```

sort 可以进行排序，1 为生序，-1 为降序

```
item> db.items.find().sort({"price":1})
[
  {
    _id: ObjectId('66e170966a1879410cf28448'),
    id: 1,
    price: 1.2,
    quantity: 1
  },
  {
    _id: ObjectId('66e171866a1879410cf2844b'),
    id: 4,
    price: 8,
    quantity: 3
  },
  {
    _id: ObjectId('66e1711c6a1879410cf28449'),
    id: 2,
    price: 9.9,
    quantity: 12
  },
  {
    _id: ObjectId('66e171866a1879410cf2844a'),
    id: 3,
    price: 10,
    quantity: 34
  }
]
```

limit 可以限制输出数量， count 可以计数

```
item> db.items.find().limit(2)
[
  {
    _id: ObjectId('66e170966a1879410cf28448'),
    id: 1,
    price: 1.2,
    quantity: 1
  },
  {
    _id: ObjectId('66e1711c6a1879410cf28449'),
    id: 2,
    price: 9.9,
    quantity: 12
  }
]
item> db.items.find().limit(2).count()
2
```

document 的值可以是一个 nested document，也可以是数组

```
item> db.items.insertOne({"id": 5, "price": 9.9, "quantity": 1, tags: ["green", "cheap"]})
{
  acknowledged: true,
  insertedId: ObjectId('66e172ed6a1879410cf2844c')
}
item> db.items.insertOne({"id": 6, "price": 10, "quantity": 12, tags: ["expensive", "red"], size: { h: 22, w: 13}})
{
  acknowledged: true,
  insertedId: ObjectId('66e173276a1879410cf2844d')
}
item> db.items.insertOne({"id": 7, "price": 1.2, "quantity": 1, tags: ["green"], size: { h: 28, w: 13}, "review":[{name:"jeff", content:"good"},{name:"mary", content:"so so"}]})
{
  acknowledged: true,
  insertedId: ObjectId('66e173996a1879410cf2844f')
}
```

范围查询，gt 大于，gte 大于等于，lt 小于，lte 小于等于

```
item> db.items.find({"quantity":{"$gt":12}})
[
  {
    _id: ObjectId('66e171866a1879410cf2844a'),
    id: 3,
    price: 10,
    quantity: 34
  }
]
item> db.items.find({"price":{"$lte":1.2}})
[
  {
    _id: ObjectId('66e170966a1879410cf28448'),
    id: 1,
    price: 1.2,
    quantity: 1
  },
  {
    _id: ObjectId('66e173996a1879410cf2844f'),
    id: 7,
    price: 1.2,
    quantity: 1,
    tags: [ 'green' ],
    size: { h: 28, w: 13 },
    review: [
      { name: 'jeff', content: 'good' },
      { name: 'mary', content: 'so so' }
    ]
  }
]

```

多参数查找

```
item> db.items.find({"price": 1.2, "quantity": 1})
[
  {
    _id: ObjectId('66e170966a1879410cf28448'),
    id: 1,
    price: 1.2,
    quantity: 1
  },
  {
    _id: ObjectId('66e173996a1879410cf2844f'),
    id: 7,
    price: 1.2,
    quantity: 1,
    tags: [ 'green' ],
    size: { h: 28, w: 13 },
    review: [
      { name: 'jeff', content: 'good' },
      { name: 'mary', content: 'so so' }
    ]
  }
]
```


可以用 `$or` 进行 “或” 查询，传入数组，查询出满足里面任意条件的结果

```
item> db.items.find({"$or":[{"price":8},{"quantity":34}]})
[
  {
    _id: ObjectId('66e171866a1879410cf2844a'),
    id: 3,
    price: 10,
    quantity: 34
  },
  {
    _id: ObjectId('66e171866a1879410cf2844b'),
    id: 4,
    price: 8,
    quantity: 3
  }
]
```

`$in` 可以查找在给定集合中的数据，nin 可以查询不在集合中的数据

```
item> db.items.find({"quantity":{"$in":[3,34]}})
[
  {
    _id: ObjectId('66e171866a1879410cf2844a'),
    id: 3,
    price: 10,
    quantity: 34
  },
  {
    _id: ObjectId('66e171866a1879410cf2844b'),
    id: 4,
    price: 8,
    quantity: 3
  }
]
item> db.items.find({"quantity":{"$nin":[1,12]}})
[
  {
    _id: ObjectId('66e171866a1879410cf2844a'),
    id: 3,
    price: 10,
    quantity: 34
  },
  {
    _id: ObjectId('66e171866a1879410cf2844b'),
    id: 4,
    price: 8,
    quantity: 3
  }
]
```


数组查询，传入单个会匹配含有这个元素的数据，传入数组会匹配完全匹配的数据

```
item> db.items.find({"tags":"green"})
[
  {
    _id: ObjectId('66e172ed6a1879410cf2844c'),
    id: 5,
    price: 9.9,
    quantity: 1,
    tags: [ 'green', 'cheap' ]
  },
  {
    _id: ObjectId('66e173996a1879410cf2844f'),
    id: 7,
    price: 1.2,
    quantity: 1,
    tags: [ 'green' ],
    size: { h: 28, w: 13 },
    review: [
      { name: 'jeff', content: 'good' },
      { name: 'mary', content: 'so so' }
    ]
  }
]
item> db.items.find({"tags":["green","cheap"]})
[
  {
    _id: ObjectId('66e172ed6a1879410cf2844c'),
    id: 5,
    price: 9.9,
    quantity: 1,
    tags: [ 'green', 'cheap' ]
  }
]

```

`$all` 可以查询包含这些元素的数据，不考虑顺序

```
item> db.items.find({"tags":{"$all":["cheap","green"]}})
[
  {
    _id: ObjectId('66e172ed6a1879410cf2844c'),
    id: 5,
    price: 9.9,
    quantity: 1,
    tags: [ 'green', 'cheap' ]
  }
]
```

查找 nested document

```
item> db.items.find({"size.h":22})
[
  {
    _id: ObjectId('66e173276a1879410cf2844d'),
    id: 6,
    price: 10,
    quantity: 12,
    tags: [ 'expensive', 'red' ],
    size: { h: 22, w: 13 }
  }
]

```

删除元素

deleteOne 可以删除单条数据，通常使用 primary key 删除

```
item> db.items.deleteOne({_id:ObjectId('66e170966a1879410cf28448')})
{ acknowledged: true, deletedCount: 1 }
```

deleteMany 可以删除多条数据

```
item> db.items.deleteMany({"price":9.9})
{ acknowledged: true, deletedCount: 2 }
```

更新数据

updateOne 可以更新一条数据，传入 2 个参数，第 1 个参数为数据的条件，第 2 个参数为要更新的操作。`$set` 可以用于设置新值

```
item> db.items.updateOne({_id: ObjectId('66e170966a1879410cf28448')},{$set: {price: 3.3, quantity: 2}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
item> db.items.findOne({_id:ObjectId('66e170966a1879410cf28448')})
{
  _id: ObjectId('66e170966a1879410cf28448'),
  id: 1,
  price: 3.3,
  quantity: 2
}
```

updateMany 可以更新多个元素

```
item> db.items.updateMany({price: 1.2}, {"$set": {quantity: 0}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 2,
  modifiedCount: 2,
  upsertedCount: 0
}
```

`$inc` 可以用于自增，传入自增的 key 和增加的值

```
item> db.items.updateOne({_id: ObjectId('66e170966a1879410cf28448')},{$inc: {quantity: 2}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

`$pull` 可以用从数组中删除元素，`$push` 可以插入元素，配合 `$each` 可以插入多个元素 

```
item> db.items.updateOne({_id: ObjectId('66e172ed6a1879410cf2844c')},{$pull: {tags: "green"}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
item> db.items.updateOne({_id: ObjectId('66e172ed6a1879410cf2844c')},{$push: {tags: "blue"}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
item> db.items.updateOne({_id: ObjectId('66e172ed6a1879410cf2844c')},{$push: {tags: {$each:["green", "yello"]}}})
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
item> db.items.findOne({_id: ObjectId('66e172ed6a1879410cf2844c')})
{
  _id: ObjectId('66e172ed6a1879410cf2844c'),
  id: 5,
  price: 9.9,
  quantity: 1,
  tags: [ 'cheap', 'blue', 'green', 'yello' ]
}


```

