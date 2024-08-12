---
title: Kafka
sidebar_position: 31
---

# kafka

Linkedin 开源的消息队列，多集群，可扩展

官网 https://kafka.apache.org/

下载地址：https://kafka.apache.org/downloads

### 快速上手

可直接下载二进制文件运行。当前最新版为 kafka_2.12-3.7.0.tgz 和 kafka_2.13-3.7.0.tgz 。前面的 2.13 是 Scala 的版本号。kafka 用不同版本的 Scala 构建，只有在想用 scala 且希望与 kafka 用相同版本的 scala 才需要关注。

解压缩

```
$ tar -xzf kafka_2.13-3.7.0.tgz
$ cd kafka_2.13-3.7.0
```


启动 kafka 。先启动 zookeeper，再启动 kafka server

```
# Start the ZooKeeper service
$ bin/zookeeper-server-start.sh config/zookeeper.properties


# Start the Kafka broker service
$ bin/kafka-server-start.sh config/server.properties
```

使用 jps 命令可以看到 java 进程

```
 % jps
2001 Jps
1623 Kafka
1230 QuorumPeerMain
```

创建 topic，名字为 quickstart-events

使用 `--list` 可以查看所有 topic，使用 `--describe` 可以描述 topic 

```
mac@MacdeMac-mini kafka_2.13-3.6.1 % bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
Created topic quickstart-events.
mac@MacdeMac-mini kafka_2.13-3.6.1 % bin/kafka-topics.sh --list --bootstrap-server localhost:9092
quickstart-events
mac@MacdeMac-mini kafka_2.13-3.6.1 % bin/kafka-topics.sh --describe --topic quickstart-events --bootstrap-server localhost:9092
Topic: quickstart-events	TopicId: dYnjTlTpTqOCUSE4lLFO2g	PartitionCount: 1	ReplicationFactor: 1	Configs: 
	Topic: quickstart-events	Partition: 0	Leader: 0	Replicas: 0	Isr: 0
```

运行 producer 客户端给 topic 创建 event。每一行是一个 event

```
% bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
>This is my first event
>This is my second event
```

运行 consumer 客户端消费 event

```
% bin/kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
This is my first event
This is my second event
```

删除 topic

```
bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic quickstart-events
```


### 概念

Producer  
对接外部，生产数据

Consumer  
消费数据

Topic  
消息通过 Topic 分类

Partition  
一个 Topic 可以对应多个 Partition 。一个 Partition 的数据只能由一个 Consumer 消费

Broker  
每个独立的服务器是一个 broker ，每个 partition 从属于一个 broker ，但可以分配给多个 broker 发生分区复制提供消息冗余


### Java 客户端的简单实用

生产者：

```java
// 配置生产者对象
Map<String, Object> configMap = new HashMap<String, Object>();
configMap.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
configMap.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
configMap.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");

// 根据配置创建生产者对象
KafkaProducer<String, String> producer = new KafkaProducer<>(configMap);

// 发送数据
ProducerRecord<String,String> record1 = new ProducerRecord<>("topic1", "key1", "value1");
ProducerRecord<String,String> record2 = new ProducerRecord<>("topic1", "key2", "value2");
producer.send(record1);
producer.send(record2);

// 关闭生产者对象
producer.close();
```

消费者：

```java
// 消费者对象配置
Map<String, Object> configMap = new HashMap<>();
configMap.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
configMap.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
configMap.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
configMap.put(ConsumerConfig.GROUP_ID_CONFIG, "group1");
//        configMap.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
// 创建消费者对象
KafkaConsumer<String, String> consumer = new KafkaConsumer<>(configMap);
// 订阅 topic
consumer.subscribe(Collections.singletonList("topic1"));

// 拉取数据（超时时间太短可能会得到 0 条数据）
ConsumerRecords<String, String> records = consumer.poll(2000);


System.out.println(records.count());
for(ConsumerRecord record : records) {
	System.out.println(record);
}
/* 
输出：
2
ConsumerRecord(topic = topic1, partition = 0, leaderEpoch = 0, offset = 2, CreateTime = 1723463707470, serialized key size = 4, serialized value size = 6, headers = RecordHeaders(headers = [], isReadOnly = false), key = key1, value = value1)
ConsumerRecord(topic = topic1, partition = 0, leaderEpoch = 0, offset = 3, CreateTime = 1723463707484, serialized key size = 4, serialized value size = 6, headers = RecordHeaders(headers = [], isReadOnly = false), key = key2, value = value2)
*/

// 关闭消费者对象
consumer.close();
```


### 集群

配置 zookeeper.properties

```
# the directory where the snapshot is stored.
dataDir=/tmp/cluster/zookeeper
# the port at which the clients will connect
clientPort=2182
```

配置 3 个 broker 的 server.properties

```
# broker1
# The id of the broker. This must be set to a unique integer for each broker.
broker.id=1

# The address the socket server listens on. If not configured, the host name will be equal to the value of
# java.net.InetAddress.getCanonicalHostName(), with PLAINTEXT listener name, and port 9092.
#   FORMAT:
#     listeners = listener_name://host_name:port
#   EXAMPLE:
#     listeners = PLAINTEXT://your.host.name:9092
listeners=PLAINTEXT://:9091

# A comma separated list of directories under which to store log files
log.dirs=/tmp/cluster/broker1

# broker2
broker.id=1
listeners=PLAINTEXT://:9091
log.dirs=/tmp/cluster/broker3/data

# broker3
broker.id=1
listeners=PLAINTEXT://:9091
log.dirs=/tmp/cluster/broker3/data
```
