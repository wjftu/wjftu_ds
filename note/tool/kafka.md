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


### Java 客户端的简单使用

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
zookeeper.connect=localhost:2182

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
zookeeper.connect=localhost:2182

# broker3
broker.id=1
listeners=PLAINTEXT://:9091
log.dirs=/tmp/cluster/broker3/data
zookeeper.connect=localhost:2182
```

依次启动 zookeeper 和 3 个 kafka broker 

```
# 启动 kafka1
# kafka1 日志
[2024-08-20 21:02:52,658] INFO Kafka startTimeMs: 1724158972653 (org.apache.kafka.common.utils.AppInfoParser)
[2024-08-20 21:02:52,659] INFO [KafkaServer id=1] started (kafka.server.KafkaServer)
[2024-08-20 21:02:52,763] INFO [zk-broker-1-to-controller-alter-partition-channel-manager]: Recorded new controller, from now on will use node localhost:9091 (id: 1 rack: null) (kafka.server.BrokerToControllerRequestThread)
[2024-08-20 21:02:52,789] INFO [zk-broker-1-to-controller-forwarding-channel-manager]: Recorded new controller, from now on will use node localhost:9091 (id: 1 rack: null) (kafka.server.BrokerToControllerRequestThread)

# 启动 kafka2
# kafka1 日志
[2024-08-20 21:03:43,830] INFO [Controller id=1, targetBrokerId=2] Node 2 disconnected. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:03:43,831] WARN [Controller id=1, targetBrokerId=2] Connection to node 2 (localhost/127.0.0.1:9092) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:03:43,831] INFO [Controller id=1, targetBrokerId=2] Client requested connection close from node 2 (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:03:43,934] INFO [Controller id=1, targetBrokerId=2] Node 2 disconnected. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:03:43,934] WARN [Controller id=1, targetBrokerId=2] Connection to node 2 (localhost/127.0.0.1:9092) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:03:43,934] INFO [Controller id=1, targetBrokerId=2] Client requested connection close from node 2 (org.apache.kafka.clients.NetworkClient)
# kafka2 日志
[2024-08-20 21:03:43,985] INFO [KafkaServer id=2] started (kafka.server.KafkaServer)
[2024-08-20 21:03:44,120] INFO [zk-broker-2-to-controller-alter-partition-channel-manager]: Recorded new controller, from now on will use node localhost:9091 (id: 1 rack: null) (kafka.server.BrokerToControllerRequestThread)
[2024-08-20 21:03:44,167] INFO [zk-broker-2-to-controller-forwarding-channel-manager]: Recorded new controller, from now on will use node localhost:9091 (id: 1 rack: null) (kafka.server.BrokerToControllerRequestThread)

# 启动 kafka3
# kafka1 日志
[2024-08-20 21:04:48,061] INFO [Controller id=1, targetBrokerId=3] Node 3 disconnected. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:04:48,062] WARN [Controller id=1, targetBrokerId=3] Connection to node 3 (localhost/127.0.0.1:9093) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:04:48,062] INFO [Controller id=1, targetBrokerId=3] Client requested connection close from node 3 (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:04:48,164] INFO [Controller id=1, targetBrokerId=3] Node 3 disconnected. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:04:48,164] WARN [Controller id=1, targetBrokerId=3] Connection to node 3 (localhost/127.0.0.1:9093) could not be established. Broker may not be available. (org.apache.kafka.clients.NetworkClient)
[2024-08-20 21:04:48,164] INFO [Controller id=1, targetBrokerId=3] Client requested connection close from node 3 (org.apache.kafka.clients.NetworkClient)
# kafka3 日志
[2024-08-20 21:04:48,220] INFO [KafkaServer id=3] started (kafka.server.KafkaServer)
[2024-08-20 21:04:48,373] INFO [zk-broker-3-to-controller-alter-partition-channel-manager]: Recorded new controller, from now on will use node localhost:9091 (id: 1 rack: null) (kafka.server.BrokerToControllerRequestThread)
[2024-08-20 21:04:48,391] INFO [zk-broker-3-to-controller-forwarding-channel-manager]: Recorded new controller, from now on will use node localhost:9091 (id: 1 rack: null) (kafka.server.BrokerToControllerRequestThread)
```

zookeeper 的 /brokers/ids 下有 id `1，2，3`， zookeeper 的 /controler 显示

```json
{"version":2,"brokerid":1,"timestamp":"1724158972518","kraftControllerEpoch":-1}
```


kafka 3.8 版本以后可以不需要 zookeeper，通过 kraft 算法代替。

Zookeeper 是一个开源的分布式的，为分布式框架提供协调服务的Apache项目。

ZooKeeper 数据模型的结构类似 Linux 文件系统，每个 zNode 节点通过其路径唯一标识。 

kafka broker 会注册到 zookeeper 上，每个 broker 会有全局唯一 id，会把 ip 和端口注册到 zookeeper 中。kafka 连接上 zookepper 后会在 zookepper 上创建 ZNode，有持久化的也有临时的，临时的在连接断开会删除。

broker 注册到 zookeeper 上会选举管理者 controller ，controller 如果 down 了会重新选举

第一个 broker 启动，会在 /brokers/ids 下注册，然后监听 /controller ，然后注册 /controller 节点，选举成为 controller。第二个 broker 启动，会在 /brokers/ids 下注册，然后监听 /controller ，然后注册 /controller 节点，然后会通知 broker1 集群的变化，broker1 会连接所有的 broker 并发送集群相关数据。controller 如果 down 了，监听 /controller 的 broker 会收到通知


### 使用 

创建 topic

直接向 kafka 不存在的 topic 发送消息，会发送成功，并自动创建主题，如果不需要，可以配置 `auto.create.topics.enable=false` 。通常不会用这种方式创建主题，而是手动创建。手动创建可以指定分区数和副本数。

 

NewTopic 对象创建的时候传入 3 个参数，分别是，topic 名称，分区数量，副本因子。这里 admin 只配置了 9092 ，它可以从 9092 中拿到集群信息，并在各个 broker 中创建 partition 和 node

```java
HashMap<String,Object> configMap = new HashMap<>();
configMap.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");

Admin admin = Admin.create(configMap);

NewTopic topic1 = new NewTopic("topic1", 1, (short) 1);
NewTopic topic2 = new NewTopic("topic1", 2, (short) 2);
admin.createTopics(Arrays.asList(topic1, topic2));
```

创建完成后可以看到如下文件夹

```
/tmp/cluster/broker1/data/topic1-0
/tmp/cluster/broker1/data/topic2-0
/tmp/cluster/broker2/data/topic2-0
/tmp/cluster/broker2/data/topic2-1
/tmp/cluster/broker3/data/topic2-1
```

通过可视化工具 Kafdrop 可以看到 topic1 只有一个 partition0 ，leader node 和 replica node 只有一个 1。 topic2 的 partition0 的 leader node 是 1，replica node 是 1,2，partition1 的 leader node 是 2，replica node 是 2,3

kafka 会尽可能均匀分布 leader node ，以防止热点问题

也可以手动指定分区和副本


```java
HashMap<Integer, List<Integer>> partitionMap = new HashMap<>();
// partition0 在 2,3 ，partition1 在 3,1 ，每个 partition 的第一个为 leadder
partitionMap.put(0, Arrays.asList(2,3));
partitionMap.put(1, Arrays.asList(3,1));
NewTopic topic3 = new NewTopic("topic3", partitionMap);

admin.createTopics(Arrays.asList(topic3));
```


