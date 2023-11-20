---
title: Hadoop
sidebar_position: 50
---

# Hadoop 

安装 ubuntu 20.04 虚拟机

也可以是实体机，不过没那么多机器。。。可以用 virtual box 安装多台虚拟机


查看和后台启动虚拟机

```
VBoxManage list vms
VBoxManage startvm "uuid" –type headless
```

安装 ifconfig ，用于查看ip
```
sudo apt update
sudo apt upgrade
sudo apt install ifconfig
```

安装 openssh-server 以便于 ssh 连接
```
sudo apt install openssh-server
```

安装 openssh-server 遇到报错，先安装依赖

```
sudo apt install openssh-client=1:8.2p1-4ubuntu0.2
```

使用命令 `ssh-keygen -t rsa` 生成公私钥，将公钥写入服务器的 `~/.ssh/authorized_keys`  文件内，以便免密登陆


debian 安装

配置国内源，参考 https://developer.aliyun.com/mirror/debian/

```
apt update
# 安装 ifconfig
apt install net-tools
apt install openssh-server
```

生成密钥

```
ssh-keygen -t rsa
```

将公钥写入 ~/.ssh/authorizedkeys ，以便免密登录



### 安装 jdk8 

将 jdk-8u202-linux-x64.tar.gz 文件解压到 /usr/java 

根据 https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions ，hadoop 3.2 支持 jdk 8 编译和运行

配置环境变量

编辑 /etc/profile ，添加

```
export JAVA_HOME=/usr/java/jdk1.8.0_202
export PATH=$PATH:$JAVA_HOME/bin
```

运行 `source /etc/profile`

### 安装 hadoop



下载 hadoop ，解压到一个文件夹，如 /server

运行 bin/hadoop 

```
# ./bin/hadoop
Usage: hadoop [OPTIONS] SUBCOMMAND [SUBCOMMAND OPTIONS]
or    hadoop [OPTIONS] CLASSNAME [CLASSNAME OPTIONS]
where CLASSNAME is a user-provided Java class
```

默认是单机模式，测试运行

```
$ mkdir input
$ cp etc/hadoop/*.xml input
$ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.5.jar grep input output 'dfs[a-z.]+'
$ cat output/*
```

单节点和伪分布式参考 https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html ，集群参考 ttps://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/ClusterSetup.html


编辑 etc/hadoop/hadoop-env.sh ，添加

```
export JAVA_HOME=/usr/java/jdk1.8.0_202
```

如果是 root 用户，还需要加上下面这些，不然会报错
```
export HDFS_NAMENODE_USER=root
export HDFS_DATANODE_USER=root
export HDFS_SECONDARYNAMENODE_USER=root
export YARN_RESOURCEMANAGER_USER=root
export YARN_NODEMANAGER_USER=root
```

格式化文件系统

```
bin/hdfs namenode -format
```


运行 

```
# sbin/start-dfs.sh
Starting namenodes on [localhost]
Starting datanodes
Starting secondary namenodes [ubuntu0]
ubuntu0: Warning: Permanently added 'ubuntu0,192.168.56.3' (ECDSA) to the list of known hosts.
# jps
4488 NameNode
4843 SecondaryNameNode
4635 DataNode
4973 Jps

```


### 配置


概念：

NameNode 主节点管理者  
DataNode 从节点工作者  
SecondaryNameNode 主节点辅助者

配置文件：

文件夹 etc/hadoop/

workers： 从节点 DataNode 有哪些  
hadoop-env.sh 相关环境变量  
core-site.xml 核心配置文件  
hdfs-site.xml HDFS 核心配置文件

三台虚拟机 node0 node1 node2，配置好网络 hostonly 以便能访问彼此，生成密钥并把公钥放入 ~/.ssh/authorized_keys ，配置好 /etc/hosts

修改 etc/hadoop 下的配置文件

配置 workers

```
vim wokers
node0
node1
node2
```

修改 hadoop-env.sh 配置环境变量

```shell
export JAVA_HOME=/server/jdk1.8.0_202
export HADOOP_HOME=/server/hadoop-3.3.5
export HADOOP_CONF_DIR=@HADOOP_HOME/etc/hadoop
export HADOOP_LOG_DIR=@HADOOP_HOME/logs
```
配置 core-site.xml

配置 HDFS 文件系统的网络通讯路径

配置 namenode 为 node0 ，缓冲区大小为 131072

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://node0:8020</value>
    </property>
    <property>
        <name>io.file.buffer.size</name>
        <value>4096</value>
    </property>
</configuration>
```

配置 hdfs-site.xml

依次为默认文件权限，namenode 元数据存储位置，namenode 允许哪几台节点连接，hdfs默认块大小，namenode 并发线程数，从节点 datanode 数据存储目录

```xml
<configuration>
    <property>
        <name>dfs.datanode.data.dir.perm</name>
        <value>700</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>/server/nn</value>
    </property>
    <property>
        <name>dfs.namenode.hosts</name>
        <value>node0,node1,node2</value>
    </property>
    <property>
        <name>dfs.blocksize</name>
        <value>134217728</value>
    </property>
    <property>
        <name>dfs.namenode.handler.count</name>
        <value>100</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>/server/dn</value>
    </property>
</configuration>

```

设置环境变量
```shell
vim /etc/profile

export JAVA_HOME=/server/jdk1.8.0_202
export HADOOP_HOME=/server/hadoop-3.3.5
export PATH=$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH

source /etc/profile
```

复制配置文件

```
scp workers wjf@192.168.56.8:/server/hadoop-3.3.5/etc/hadoop/
scp workers wjf@192.168.56.9:/server/hadoop-3.3.5/etc/hadoop/
scp hadoop-env.sh wjf@192.168.56.8:/server/hadoop-3.3.5/etc/hadoop/
scp hadoop-env.sh wjf@192.168.56.9:/server/hadoop-3.3.5/etc/hadoop/
scp core-site.xml wjf@192.168.56.8:/server/hadoop-3.3.5/etc/hadoop/
scp core-site.xml wjf@192.168.56.9:/server/hadoop-3.3.5/etc/hadoop/
scp hdfs-site.xml wjf@192.168.56.8:/server/hadoop-3.3.5/etc/hadoop/
scp hdfs-site.xml wjf@192.168.56.9:/server/hadoop-3.3.5/etc/hadoop/
```

node0 格式化 namenode

```
# hadoop namenode -format
WARNING: Use of this script to execute namenode is deprecated.
WARNING: Attempting to execute replacement "hdfs namenode" instead.

2023-05-16 22:24:41,711 INFO namenode.NameNode: STARTUP_MSG: 
/************************************************************
STARTUP_MSG: Starting NameNode
STARTUP_MSG:   host = debian0/127.0.1.1
STARTUP_MSG:   args = [-format]
STARTUP_MSG:   version = 3.3.5
...
2023-05-16 22:24:45,336 INFO namenode.FSImageFormatProtobuf: Image file /server/nn/current/fsimage.ckpt_0000000000000000000 of size 396 bytes saved in 0 seconds .
2023-05-16 22:24:45,368 INFO namenode.NNStorageRetentionManager: Going to retain 1 images with txid >= 0
2023-05-16 22:24:45,408 INFO namenode.FSNamesystem: Stopping services started for active state
2023-05-16 22:24:45,410 INFO namenode.FSNamesystem: Stopping services started for standby state
2023-05-16 22:24:45,415 INFO namenode.FSImage: FSImageSaver clean checkpoint: txid=0 when meet shutdown.
2023-05-16 22:24:45,418 INFO namenode.NameNode: SHUTDOWN_MSG: 
/************************************************************
SHUTDOWN_MSG: Shutting down NameNode at debian0/127.0.1.1
************************************************************/
```

启动 namenode

```
wjf@debian0:/server$ start-dfs.sh
Starting namenodes on [node0]
Starting datanodes
Starting secondary namenodes [debian0]
wjf@debian0:/server$ jps
3856 Jps
3740 SecondaryNameNode
3613 DataNode

```

datanode 也被启动

```
# jps
1590 DataNode
1640 Jps

```

访问 node0:9870 可以看到管理界面

### HDFS

HDFS 是 hadoop 的分布式存储组建

全启全停： start-dfs.sh stop-dfs.sh
单独进程启动停止： `hdfs --daemon (stat|stop|status) (namenode|datanode|secondarynamenode)`

区分文件系统（hadoop可以自动识别）

Linux:  file///usr/local/a.txt
HDFS:  hdfs://node1:9020/usr/local/a.txt


老版本命令 `hadoop fs [generic options]` ，新版本 `hdfs dfs [generic options]`

```
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -mkdir -p /home/a

wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -ls -h -R /
drwxr-xr-x   - wjf supergroup          0 2023-05-17 22:03 /home
drwxr-xr-x   - wjf supergroup          0 2023-05-17 22:03 /home/a
```

上传 下载 复制

上传可以通过 `-D dfs.replication=2` 临时修改副本
```
hdfs dfs -put [-f] [-p] <localsrc>...  <dest>

wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -put README.txt hdfs://node0:8020/
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -put -D dfs.replication=2 README.txt hdfs://node0:8020/
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -cat /README.txt
For the latest information about Hadoop, please visit our website at:

   http://hadoop.apache.org/

and our wiki, at:

   https://cwiki.apache.org/confluence/display/HADOOP/

# 复制 hdfs dfs -cp [-f] <source> <dest> （两个路径都是 hdfs）
hdfs dfs -cp /README.txt /README2.txt

# hdfs dfs -get [-f] [-p] <localsrc>...  <dest>
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -get /README2.txt .
```

追加到文件（文件无法编辑，只能够删除和追加）

```
wjf@node0:/server/hadoop-3.3.5$ echo "aaa" >> 1.txt
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -appendToFile 1.txt /README.txt
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -cat /README.txt
For the latest information about Hadoop, please visit our website at:

   http://hadoop.apache.org/

and our wiki, at:

   https://cwiki.apache.org/confluence/display/HADOOP/
aaa
```

文件的移动（或改名）和删除

删除 -rm ， skipTrash 表示跳过回收站，但回收站默认是不开启的，默认情况无需 skipTrash 即可永久删除
```
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -mv /README.txt /home
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -ls -h -R /
-rw-r--r--   3 wjf supergroup        175 2023-05-17 22:20 /README2.txt
drwxr-xr-x   - wjf supergroup          0 2023-05-17 22:35 /home
-rw-r--r--   3 wjf supergroup        179 2023-05-17 22:33 /home/README.txt
drwxr-xr-x   - wjf supergroup          0 2023-05-17 22:03 /home/a

# 删除 hdfs dfs -rm [-r] [-skipTrash] <src>
wjf@node0:/server/hadoop-3.3.5$ hdfs dfs -rm -r /home
Deleted /home
```

更多命令可以参考 https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/FileSystemShell.html

除了使用命令，也可以用 web-ui http://node0:9870/explorer.html#/ ，网页的权限是 dr.who 是没有权限操作的，可以通过配置文件赋予某个用户的权限，但是不安全


查看集群文件副本。默认文件按 block 分割，默认 256MB， 默认每个块 3 个副本，可以通过 `dfs.replication` 配置副本数

```
wjf@node0:~$ hdfs fsck /wjf/aa/hosts -files -blocks -locations
Connecting to namenode via http://node0:9870/fsck?ugi=wjf&files=1&blocks=1&locations=1&path=%2Fwjf%2Faa%2Fhosts
FSCK started by wjf (auth:SIMPLE) from /192.168.56.7 for path /wjf/aa/hosts at Thu May 18 20:53:52 CST 2023

/wjf/aa/hosts 228 bytes, replicated: replication=3, 1 block(s):  OK
0. BP-1743682380-127.0.1.1-1684248434454:blk_1073741827_1005 len=228 Live_repl=3  [DatanodeInfoWithStorage[192.168.56.7:9866,DS-4f33e3c9-e8e1-4d70-b3dd-3de2882ecd31,DISK], DatanodeInfoWithStorage[192.168.56.9:9866,DS-03fb8214-a502-4a27-8ba0-5c7c18636708,DISK], DatanodeInfoWithStorage[192.168.56.8:9866,DS-3073fa17-c53e-49fe-b29a-6adf9dc840eb,DISK]]

Status: HEALTHY
 Number of data-nodes:	3
 Number of racks:		1
 Total dirs:			0
 Total symlinks:		0

Replicated Blocks:
 Total size:	228 B
 Total files:	1
 Total blocks (validated):	1 (avg. block size 228 B)
 Minimally replicated blocks:	1 (100.0 %)
 Over-replicated blocks:	0 (0.0 %)
 Under-replicated blocks:	0 (0.0 %)
 Mis-replicated blocks:		0 (0.0 %)
 Default replication factor:	3
 Average block replication:	3.0
 Missing blocks:		0
 Corrupt blocks:		0
 Missing replicas:		0 (0.0 %)
 Blocks queued for replication:	0

Erasure Coded Block Groups:
 Total size:	0 B
 Total files:	0
 Total block groups (validated):	0
 Minimally erasure-coded block groups:	0
 Over-erasure-coded block groups:	0
 Under-erasure-coded block groups:	0
 Unsatisfactory placement block groups:	0
 Average block group size:	0.0
 Missing block groups:		0
 Corrupt block groups:		0
 Missing internal blocks:	0
 Blocks queued for replication:	0
FSCK ended at Thu May 18 20:53:52 CST 2023 in 16 milliseconds


The filesystem under path '/wjf/aa/hosts' is HEALTHY

```

edits 文件记录 hdfs 每一次操作，edits 达到上限大小后会开启新的文件记录。FSImage 文件是 edits 操作的合并（某个时间节点前的全部文件状态信息），会定期将全部 edits 文件与 fsimage 合并形成新的 fsimage 。文件存放在 `dfs.datanode.data.dir` ，默认 1 小时或 100 万事务会合并元数据，合并操作由 secondarynamenode 执行

写入流程：

客户端发送请求到 namenode 。namenode 审核，若满足条件允许写入，告知客户端写入的 datanode 地址。客户端向 datanode 发送数据包。datanode 同时完成副本复制工作，并将数据发给其他 datanode。写入完成后通知 namenode， namenode 记录元数据。

namenode 不负责写入，只负责记录元数据和审批权限。datanode 写数据，但客户端只需向其中一台 datanode 发送，副本复制由 datanode 之间自行完成。

读取流程：

客户端发送读取请求， namenode 允许并告知 block 列表，客户端根据 block 列表自行从 datanode 读取所需的 block 

namenode 提供的 block 会根据网络距离计算，尽量离客户端近


### MapReduce 和 Yarn

分散 - 汇总

MapReduce 是基于 YARN 运行的，YARN 是资源调度组件。



YARN 架构： 主从架构，主（master）角色：ResourceManager 整个集群的资源调度着，从（slave）角色：NodeManager 单个服务的调度者，接受 Resource Manager 的任务，创建容器，回收资源。

node0 搭建 ResourceManager NodeManager ProxyServer JobHistoryServer ， node1 node2 搭建 NodeManager 

配置 mapreduce

mapred-env.sh
```
export JAVA_HOME=/server/jdk1.8.0_202
# JobHistoryServer 进程内存
export HADOOP_JOB_HISTORYSERVER_HEAPSIZE=256
# 日志级别
export HADOOP_MAPRED_ROOT_LOGGER=INFO,RFA
```

mapred-site.xml
```xml
<property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
    <description>运行框架设置为yarn</description>
</property>
<property>
    <name>mapreduce.jobhistory.address</name>
    <value>node0:10020</value>
    <description>JobHistoryServer</description>
</property>

<property>
  <name>yarn.app.mapreduce.am.env</name>
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<property>
  <name>mapreduce.map.env</name>
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
<property>
  <name>mapreduce.reduce.env</name>
  <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
</property>
```

yarn-env.sh

```shell
export JAVA_HOME=/server/jdk1.8.0_202
export HADOOP_HOME=/server/hadoop-3.3.5
export HADOOP_CONFIG_DIR=${HADOOP_HOME}/etc/hadoop
export HADOOP_LOG_DIR=${HADOOP_HOME}/logs
```

yarn-site.xml

```
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>node0</value>
    <description></description>
  </property>

  <property>
    <name>yarn.nodemanager.local-dirs</name>
    <value>/server/nm-local</value>
    <description>nodemanager中间数据存储路径</description>
  </property>

  <property>
    <name>yarn.nodemanager.log-dirs</name>
    <value>/server/nm-log</value>
    <description>nodemanager数据日志本地存储路径</description>
  </property>

  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
    <description>为mapreduce开启shuffle服务</description>
  </property>

  <property>
    <name>yarn.log.server.url</name>
    <value>http://node0:19888/jobhistory/logs</value>
    <description>历史服务器url</description>
  </property>

  <property>
    <name>yarn.web.proxy.address</name>
    <value>hode0:8089</value>
    <description>代理服务器</description>
  </property>
  <property>
    <name>yarn.log.aggregation-enable</name>
    <value>true</value>
    <description>日志聚合</description>
  </property>
  <property>
    <name>yarn.nodemanager.remote-app-log-dir</name>
    <value>/tmp/logs</value>
    <description>程序日志HDFS存储路径</description>
  </property>
  <property>
    <name>yarn.resourcemanager.scheduler.class</name>
    <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.fair.FairScheduler</value>
    <description>选择公平调度器</description>
  </property>

  

```

复制配置文件

```
$ scp mapred-env.sh mapred-site.xml yarn-env.sh yarn-site.xml node1:`pwd`/ 
$ scp mapred-env.sh mapred-site.xml yarn-env.sh yarn-site.xml node2:`pwd`/
```


```
# 集群启动
start-yarn.sh
# 集群停止
stop-yarn.sh

# 单台操作
yarn --daemon start|stop resourcemanager|nodemanager|proxyserver

# 历史服务器启动和停止
#mapred --daemon start|stop historyserver
```

```
$ jps
2081 NodeManager
1235 DataNode
1141 NameNode
1365 SecondaryNameNode
2535 Jps
2474 JobHistoryServer
1994 ResourceManager
```

可以通过 http://node0:8088/ 查看 yarn 页面，http://node0:19888/ 可以查看 historyserver 页面

yarn 启动时从 yarn-site.xml 读取配置，确定 ResourceManager 所在机器，启动它。读取 workers 文件，启动全部 NodeManager。在当前机器启动 ProxyServer 


yarn 可以运行 MapReduce 、 Spark 、 Flink 程序


mapreduce 启动命令

```
hadoop jar [程序文件] [java类名] [参数1] [参数2]
```

试着运行一下 mapreduce 程序。在 hdfs 中放置一个文本文件在 /input 目录，运行 wordcount 

```
$ hadoop jar /server/hadoop-3.3.5/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.5.jar wordcount hdfs://node0:8020/input hdfs://node0:8020/output/wc
2023-05-22 22:14:16,556 INFO client.DefaultNoHARMFailoverProxyProvider: Connecting to ResourceManager at node0/192.168.56.7:8032
2023-05-22 22:14:17,355 INFO mapreduce.JobResourceUploader: Disabling Erasure Coding for path: /tmp/hadoop-yarn/staging/wjf/.staging/job_1684762859481_0003
2023-05-22 22:14:17,781 INFO input.FileInputFormat: Total input files to process : 1
2023-05-22 22:14:17,927 INFO mapreduce.JobSubmitter: number of splits:1
2023-05-22 22:14:18,171 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1684762859481_0003
2023-05-22 22:14:18,171 INFO mapreduce.JobSubmitter: Executing with tokens: []
2023-05-22 22:14:18,400 INFO conf.Configuration: resource-types.xml not found
2023-05-22 22:14:18,402 INFO resource.ResourceUtils: Unable to find 'resource-types.xml'.
2023-05-22 22:14:18,482 INFO impl.YarnClientImpl: Submitted application application_1684762859481_0003
2023-05-22 22:14:18,561 INFO mapreduce.Job: The url to track the job: http://node0:8088/proxy/application_1684762859481_0003/
2023-05-22 22:14:18,562 INFO mapreduce.Job: Running job: job_1684762859481_0003
2023-05-22 22:14:27,908 INFO mapreduce.Job: Job job_1684762859481_0003 running in uber mode : false
2023-05-22 22:14:27,924 INFO mapreduce.Job:  map 0% reduce 0%
2023-05-22 22:14:36,064 INFO mapreduce.Job:  map 100% reduce 0%
2023-05-22 22:14:44,165 INFO mapreduce.Job:  map 100% reduce 100%
2023-05-22 22:14:45,193 INFO mapreduce.Job: Job job_1684762859481_0003 completed successfully
...
	File Input Format Counters 
		Bytes Read=49
	File Output Format Counters 
		Bytes Written=48
```

查看结果
```
wjf@node0:/server/hadoop-3.3.5/etc/hadoop$ hdfs dfs -ls -R -h /output
drwxr-xr-x   - wjf supergroup          0 2023-05-22 22:14 /output/wc
-rw-r--r--   3 wjf supergroup          0 2023-05-22 22:14 /output/wc/_SUCCESS
-rw-r--r--   3 wjf supergroup         48 2023-05-22 22:14 /output/wc/part-r-00000
wjf@node0:/server/hadoop-3.3.5/etc/hadoop$ hdfs dfs -cat /output/wc/part-r-00000
afternoon	1
bye	1
good	3
hello	1
hi	2
morning	1
```

3 个节点 10000 样本蒙特卡罗求圆周率

```
wjf@node0:/server/hadoop-3.3.5$ hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.5.jar pi 3 10000
Number of Maps  = 3
Samples per Map = 10000
Wrote input for Map #0
Wrote input for Map #1
Wrote input for Map #2
Starting Job
2023-05-22 22:33:32,244 INFO client.DefaultNoHARMFailoverProxyProvider: Connecting to ResourceManager at node0/192.168.56.7:8032
2023-05-22 22:33:32,789 INFO mapreduce.JobResourceUploader: Disabling Erasure Coding for path: /tmp/hadoop-yarn/staging/wjf/.staging/job_1684762859481_0005
2023-05-22 22:33:33,000 INFO input.FileInputFormat: Total input files to process : 3
2023-05-22 22:33:33,113 INFO mapreduce.JobSubmitter: number of splits:3
...
Job Finished in 29.323 seconds
Estimated value of Pi is 3.14146666666666666667
```

实现分布式计算是不容易的，MapReduce 可以让我们通过实现接口的方式完成业务逻辑，无需管理资源，具有容错性。MapReduce 不擅长实时响应的计算，不擅长串行计算。

MrAppMaster 负责调度和状态协调，MapTask 负责整个数据处理流程，ReduceTask 负责 Reduce 阶段数据处理

依赖

```xml
<dependency>
    <groupId>org.apache.hadoop</groupId>
    <artifactId>hadoop-client</artifactId>
    <version>3.1.3</version>
</dependency>

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>

<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.30</version>
</dependency>
```

一个 word count 示例程序

```java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

import java.io.IOException;

public class WordCountMapper extends Mapper<LongWritable, Text,Text, IntWritable> {

    private Text outK = new Text();
    private IntWritable outV = new IntWritable();

    @Override
    protected void map(LongWritable key, Text value, Mapper<LongWritable, Text, Text, IntWritable>.Context context) throws IOException, InterruptedException {
        String line = value.toString();

        String[] words = line.split(" ");

        for(String w: words) {
            outK.set(w);
            outV.set(1);
            context.write(outK, outV);
        }
    }
}
```

Reducer

```java
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class WordCountReducer extends Reducer<Text, IntWritable, Text, IntWritable> {

    IntWritable outV = new IntWritable();
    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Reducer<Text, IntWritable, Text, IntWritable>.Context context) throws IOException, InterruptedException {
        int sum = 0;
        for(IntWritable value: values) {
            sum += value.get();
        }
        outV.set(sum);
        context.write(key, outV);
    }
}
```

Driver

```java

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;

public class WordCountDriver {
    public static void main(String[] args) throws IOException, InterruptedException, ClassNotFoundException {
        //1 获取job
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);

        // 2 设置 jar 路径
        job.setJarByClass(WordCountDriver.class);

        // 3 关联 mapper 和 reducer
        job.setMapperClass(WordCountMapper.class);
        job.setReducerClass(WordCountReducer.class);

        // 4 设置 map 输出的 k v 类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);

        // 5 设置最终输出的 k v 类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        // 6 设置输入输出路径
        FileInputFormat.setInputPaths(job, new Path("src/main/resources/input"));
        FileOutputFormat.setOutputPath(job, new Path("src/main/resources/output"));

        // 7 提交 job
        // 监控并打印信息
        boolean result = job.waitForCompletion(true);

        System.exit(result ? 0 : 1);

    }

}
```

输出文件：

_SUCCESS 为信号文件，表示结果成功，part-r-00000 为 00000 分区的结果

在 hadoop 集群上运行：maven 打包（无需带依赖，因为 hadoop 集群上有需要的依赖），将 jar 包放到节点上，将数据放入输入路径，确保输出路径为空

运行，指定 jar 包和全类名

```
hadoop jar wordcount.jar com.wjftu.WordCountDriver
```



### Hive 

Metastore 用于元数据存储

Driver 驱动程序完成 sql 解析，执行优化，代码提交

用户接口提供用户交互功能

Hive 是单机工具，但可以提交到分布式的 MapReduce 程序运行

```
wget https://dev.mysql.com/get/mysql-apt-config_0.8.18-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.18-1_all.deb
# 选择 debian buster -> myusql server -> mysql-5.7
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 467B942D3A79BD29
apt update 
sudo apt install -y mysql-community-server
systemctl restart mysql
systemctl enable mysql
```

core-site.xml 添加配置，允许代理

```xml
<property>
    <name>hadoop.proxyuser.hadoop.hosts</name>
    <value>*</value>
</property>
<property>
    <name>hadoop.proxyuser.hadoop.groups</name>
    <value>*</value>
</property>
```

https://archive.apache.org/dist/ 从 apache archive 下载 Hive ，以及 Hive 需要的 mysql 驱动。Hive 有元数据管理功能，需要数据库，这里用 MySql

```
wget https://archive.apache.org/dist/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz
wget https://search.maven.org/remotecontent?filepath=com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar
tar -zxvf apache-hive-3.1.3-bin.tar.gz 
mv mysql-connector-j-8.0.33.jar apache-hive-3.1.3-bin/lib/
```

创建数据库 

```sql
create database hive charset utf8;
```

配置 hive-env.sh

```
export HADOOP_HOME=/server/hadoop-3.3.5
export HIVE_CONF_DIR=/server/apache-hive-3.1.3-bin/conf
export HIVE_AUX_JARS_PATH=/server/apache-hive-3.1.3-bin/lib
```


```xml
<configuration>
    <property>
        <name>javax.jdo.option.ConnectionURL</name>
        <value>jdbc:mysql://node0:3306/hive?createDatabaseIfNotExist=true&amp;useSSL=false&amp;useUnicode=true&amp;charsetEncoding=UTF-8</value>
    </property>
    <property>
        <name>javax.jdo.option.ConnectionDriverName</name>
        <value>com.mysql.cj.jdbc.Driver</value>
    </property>
    <property>
        <name>javax.jdo.option.ConnectionUserName</name>
        <value>root</value>
    </property>
    <property>
        <name>javax.jdo.option.ConnectionPassword</name>
        <value>123456</value>
    </property>
    <property>
        <name>hive.server2.thrift.bind.host</name>
        <value>node0</value>
    </property>
    <property>
        <name>hive.metastore.uris</name>
        <value>thrift://node0:9083</value>
    </property>
    <property>
        <name>hive.metastore.event.db.notification.api.auth</name>
        <value>false</value>
    </property>
</configuration>
```

运行 bin/schematool ，初始化元数据，制定数据库为 mysql ，verbos 表示输出详细信息
```
$ ./schematool -initSchema -dbType mysql -verbos
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/server/apache-hive-3.1.3-bin/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/server/hadoop-3.3.5/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Metastore connection URL:	 jdbc:mysql://node0:3306/hive?createDatabaseIfNotExist=true&useSSL=false&useUnicode=true&charsetEncoding=UTF-8
Metastore Connection Driver :	 com.mysql.cj.jdbc.Driver
Metastore connection User:	 root
Starting metastore schema initialization to 3.1.0
Initialization script hive-schema-3.1.0.mysql.sql

Initialization script completed
schemaTool completed

```

会初始化很多表

```
mysql> show tables;
+-------------------------------+
| Tables_in_hive                |
+-------------------------------+
| AUX_TABLE                     |
| BUCKETING_COLS                |
| CDS                           |
| COLUMNS_V2                    |
| COMPACTION_QUEUE              |
...
| WM_POOL                       |
| WM_POOL_TO_TRIGGER            |
| WM_RESOURCEPLAN               |
| WM_TRIGGER                    |
| WRITE_SET                     |
+-------------------------------+
74 rows in set (0.00 sec)

```

启动元数据管理服务（不然无法使用），Jps 显示为 RunJar

（启动之前新建日志文件夹 logs）
```
# 前台启动
bin/hive --service metastore

# 后台启动
nohup bin/hive --service metastore >> logs/metastore.log 2>&1 &

wjf@node0:/server/apache-hive-3.1.3-bin$ jps
2341 Jps
1686 NameNode
1913 SecondaryNameNode
1372 RunJar
1773 DataNode
```

有两种客户端， 一种是 Hive shell， 可直接写 sql ， 通过 `bin/hive`  启动。另一种是 Hive ThriftServer ，需要连接外部客户端， `bin/hive --service hiveserver2`

（启动客户端之前先把 hdfs 和 yarn 启动起来）

可以看到有一个 default 数据库

```
$ bin/hive
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/server/apache-hive-3.1.3-bin/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
...
Hive Session ID = d93a6567-47b3-43d8-b6da-5eb936f5c6d9
hive> show databases;
OK
default
Time taken: 0.031 seconds, Fetched: 1 row(s)
```

创建表，插入数据，需要计算的 sql 会经过 mapReduce，用时特别长。。。可以在 yarn 的页面查看任务

```
hive> create table test(id int, name string, gender string);
OK
hive> insert into test(id, name, gender) values(3,'jim','M');
Query ID = wjf_20230525225053_71997c85-7263-459a-8a7c-25a95db71411
Total jobs = 3
Launching Job 1 out of 3
Number of reduce tasks determined at compile time: 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
Starting Job = job_1685026202353_0001, Tracking URL = http://node0:8088/proxy/application_1685026202353_0001/
Kill Command = /server/hadoop-3.3.5/bin/mapred job  -kill job_1685026202353_0001
Hadoop job information for Stage-1: number of mappers: 1; number of reducers: 1
2023-05-25 22:51:54,775 Stage-1 map = 0%,  reduce = 0%
2023-05-25 22:52:11,383 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 3.4 sec
2023-05-25 22:52:32,190 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 5.83 sec
MapReduce Total cumulative CPU time: 5 seconds 830 msec
Ended Job = job_1685026202353_0001
Stage-4 is selected by condition resolver.
Stage-3 is filtered out by condition resolver.
Stage-5 is filtered out by condition resolver.
Moving data to directory hdfs://node0:8020/user/hive/warehouse/test/.hive-staging_hive_2023-05-25_22-50-53_595_7784313467016506868-1/-ext-10000
Loading data to table default.test
MapReduce Jobs Launched: 
Stage-Stage-1: Map: 1  Reduce: 1   Cumulative CPU: 5.83 sec   HDFS Read: 16341 HDFS Write: 273 SUCCESS
Total MapReduce CPU Time Spent: 5 seconds 830 msec
OK
Time taken: 102.321 seconds
hive> select * from test;
OK
3	jim	M
Time taken: 0.326 seconds, Fetched: 1 row(s)
hive> select gender, count(*) from test group by gender;
Query ID = wjf_20230525225744_71573bcb-9912-4616-b40a-34da45252226
Total jobs = 1
Launching Job 1 out of 1
Number of reduce tasks not specified. Estimated from input data size: 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
Starting Job = job_1685026202353_0002, Tracking URL = http://node0:8088/proxy/application_1685026202353_0002/
Kill Command = /server/hadoop-3.3.5/bin/mapred job  -kill job_1685026202353_0002
Hadoop job information for Stage-1: number of mappers: 1; number of reducers: 1
2023-05-25 22:58:34,876 Stage-1 map = 0%,  reduce = 0%
2023-05-25 22:58:46,462 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 2.16 sec
2023-05-25 22:59:03,818 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 5.49 sec
MapReduce Total cumulative CPU time: 5 seconds 490 msec
Ended Job = job_1685026202353_0002
MapReduce Jobs Launched: 
Stage-Stage-1: Map: 1  Reduce: 1   Cumulative CPU: 5.49 sec   HDFS Read: 12811 HDFS Write: 103 SUCCESS
Total MapReduce CPU Time Spent: 5 seconds 490 msec
OK
M	1
Time taken: 80.142 seconds, Fetched: 1 row(s)
```

default 数据库中的 test 表存放在 `/user/hive/warehouse/test/` ，查看文件可以看到表的内容（列之间有不可见的分隔符）

```
wjf@node0:/server/apache-hive-3.1.3-bin/logs$ hdfs dfs -ls -r /user/hive/warehouse/test
Found 1 items
-rw-r--r--   3 wjf supergroup          8 2023-05-25 22:52 /user/hive/warehouse/test/000000_0
wjf@node0:/server/apache-hive-3.1.3-bin/logs$ hdfs dfs -cat /user/hive/warehouse/test/*
3jimM
4MaryF

```

hiveserver2 是 Hive 内置的 ThriftServer 服务，提供 Thrift 端口供其他客户端连接，例如 Hive 内置的 beeline

启动 hiveserver2 ，JPS 中同样名称是 `RunJar`
```
nohup bin/hive --service hiveserver2 >> logs/hiveserver2.log 2>&1 &
```

使用 `bin/beeline` 启动 beeline ，使用 `!connect` 命令连接数据库
 

需要添加以下配置，不然 beeline 无法连接

```
# hive-site.xml
<property>
 <name>hive.server2.enable.doAs</name>
 <value>true</value>
</property>  


# hadoop core-site.xml
<property>
  <name>hadoop.proxyuser.myusergroup.groups</name>
<value>*</value>
</property>

<property>
 <name>hadoop.proxyuser.myusername.hosts</name>
 <value>*</value>
</property>
```

启动 beeline

```
$ bin/beeline 
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/server/apache-hive-3.1.3-bin/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/server/hadoop-3.3.5/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/server/apache-hive-3.1.3-bin/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/server/hadoop-3.3.5/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Beeline version 3.1.3 by Apache Hive
beeline> !connect jdbc:hive2://node0:10000 
Connecting to jdbc:hive2://node0:10000
Enter username for jdbc:hive2://node0:10000: wjf
Enter password for jdbc:hive2://node0:10000: 
Connected to: Apache Hive (version 3.1.3)
Driver: Hive JDBC (version 3.1.3)
Transaction isolation: TRANSACTION_REPEATABLE_READ
0: jdbc:hive2://node0:10000> select * from test;
INFO  : Compiling command(queryId=wjf_20230529222057_b1e2de31-e06a-4447-9438-a7019fc98105): select * from test
INFO  : Concurrency mode is disabled, not creating a lock manager
INFO  : Semantic Analysis Completed (retrial = false)
INFO  : Returning Hive schema: Schema(fieldSchemas:[FieldSchema(name:test.id, type:int, comment:null), FieldSchema(name:test.name, type:string, comment:null), FieldSchema(name:test.gender, type:string, comment:null)], properties:null)
INFO  : Completed compiling command(queryId=wjf_20230529222057_b1e2de31-e06a-4447-9438-a7019fc98105); Time taken: 2.595 seconds
INFO  : Concurrency mode is disabled, not creating a lock manager
INFO  : Executing command(queryId=wjf_20230529222057_b1e2de31-e06a-4447-9438-a7019fc98105): select * from test
INFO  : Completed executing command(queryId=wjf_20230529222057_b1e2de31-e06a-4447-9438-a7019fc98105); Time taken: 0.003 seconds
INFO  : OK
INFO  : Concurrency mode is disabled, not creating a lock manager
+----------+------------+--------------+
| test.id  | test.name  | test.gender  |
+----------+------------+--------------+
| 3        | jim        | M            |
| 4        | Mary       | F            |
| 1        | John       | M            |
| 2        | sam        | M            |
+----------+------------+--------------+
4 rows selected (3.112 seconds)
```

beeline 使用起来较原生命令行客户端更美观。也可以使用图形化的 DataGrip 和 DBeaver 连接 Hive ，使用体验更好

创建数据库
```
0: jdbc:hive2://node0:10000> create database mydatabase1;

No rows affected (0.104 seconds)
0: jdbc:hive2://node0:10000> show databases;
I
+----------------+
| database_name  |
+----------------+
| default        |
| mydatabase1    |
+----------------+
2 rows selected (0.079 seconds)
0: jdbc:hive2://node0:10000> use mydatabase1;
No rows affected (0.075 seconds)
0: jdbc:hive2://node0:10000> create table test(id int);
No rows affected (0.683 seconds)
0: jdbc:hive2://node0:10000> show tables;
+-----------+
| tab_name  |
+-----------+
| test      |
+-----------+
1 row selected (0.111 seconds)
0: jdbc:hive2://node0:10000> desc test;
+-----------+------------+----------+
| col_name  | data_type  | comment  |
+-----------+------------+----------+
| id        | int        |          |
+-----------+------------+----------+
1 row selected (0.097 seconds)
```

数据库操作命令

HIVE 库在 hdfs 上是一个名称以 `.db` 结尾的文件夹

```
# 创建数据库，默认路径 hdfs://ip:port/user/hive/warehouse/databasename.db 
create database [if not exists] db_name [location '/path/to/database'];
# 删除数据库，如果存在表需要加上 cascade
drop database db_name [cascade];
# 数据库详细信息
desc database db_name
```

创建表

hive 包括 内部表，外部表，等。内部表默认位置 /user/hive/warehouse ，默认创建的是内部表，desc 显示 managed_table 。外部表创建需要加上 external 并加上 location （路径，文件夹级别），desc 显示 external_table。删除内部表会删除数据和元信息，是 hive 管理的表，持久使用。外部表只会删除元数据，数据会保留，用于临时链接外部数据，可以先有表也可以先有数据

创建表时可以自定义列分隔符，外部表通常自定义分隔符，与外部数据保持一致，默认分隔符 `^A` ，也就是 8 进制 `\001`
```
# 创建内部表
create table tb_name (col_name col_type ...)
# 创建外部表
craete external table tb_name (col_name col_type ...) row format delimited fields terminated by '\t' location ...
```


导入数据创建一个外部表

```
$ hdfs dfs -cat /my/table/mytable.txt
1	jeff
2	john
3	mary
4	tim
> create external table mytable (id int, name string) row format delimited fields terminated by '\t' location '/my/table';
> select * from mytable;
+-------------+---------------+
| mytable.id  | mytable.name  |
+-------------+---------------+
| 1           | jeff          |
| 2           | john          |
| 3           | mary          |
| 4           | tim           |
+-------------+---------------+
```

内外部表转换

```
alter table tb_name set tblproperties('EXTERNAL'='TRUE' | 'FALSE')
```

加载数据

使用 LOAD DATA 命令加载，LOCAL 代表本地数据，不带 `LOCAL` 表示 HDFS 路径， `OVERWRITE` 覆盖已经存在的。如果基于 hdfs 加载数据，源文件会移动到表所在的目录，源文件会消失。也可以使用 `insert select` 命令导入数据，会走 mapreduce



```
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tb_name
insert [into | overwrite] table tb1 select * from tb2
```

导出数据命令类似。如果不定义分隔符，默认就是 `\001` 。如果不加 local 则导入到 hdfs

也可以使用 hive shell 导出 ， `-e` 表示执行 sql 语句，`-f` 表示执行 sql 文件，然后重定向
```
insert overwrite [local] directory '/my/dir' [row format delimited fields terminated by '\t'] select * from tb

bin/hive -e “select * from db1.tb1;" > /path
bin/hive -f export.sql > /path
```

Hive 也有分区表的概念，类似关系型数据库的分库分表，当数据量大的时候，可以使用分区表，分区表是通过文件夹实现的。查询数据的时候会额外带上分区列。分区可以多层级，插入的的时候要指定每一层。

使用 `partition` 创建分区表

```
create table tb_name(...) paartitioned by (分区列 列类型, ...) row format delimited fields terminated by '\t'
load data local inpath '/path.txt' into table mydb.mytable partition(mounth='202306')
```

插入数据，数据会带上分区列

```
>load data local inpath '/server/tmp/student.txt' into table mydb.student partition(month='202306');

> select * from mydb.student;
+-------------+----------------+----------------+
| student.id  | student.score  | student.month  |
+-------------+----------------+----------------+
| jeff        | 99             | 202306         |
| merry       | 100            | 202306         |
| john        | 89             | 202306         |
| jim         | 93             | 202306         |
+-------------+----------------+----------------+
```

数据存放在 `/user/hive/warehouse/mydb.db/student/month=202306/student.txt`

同样的，可以创建多分区列，插入时需要指定所有分区

```
create table mydb.student2(id string, score int) partitioned by (year string, month string) row format delimited fields terminated by '\t';
load data local inpath '/server/tmp/student.txt' into table mydb.student2 partition(year='2023',month='06');
# 数据存放在 /user/hive/warehouse/mydb.db/student2/year=2023/month=06/student.txt
```

分桶表

类似于分区表，不同于分区表将文件存放在不同文件夹中，分桶是将表拆分到固定数量的不同文件中

使用 `clustered by(col) into n buckets` 创建分桶表

```
# 自动匹配 reduce task 数量与桶数量一致
set hive.enforce.bucketing=true;

# 创建分桶表
create table student3(id string, score int) clustered by (id) into 3 buckets row format delimited fields terminated by '\t';

```

分桶表无法通过 load data 加载数据，只能通过 insert select 。比较好的方式是创建临时表，通过 load data 加载到临时表，再通过 insert select 加载

```
# 创建临时表
create table student3_tmp(id string, score int) row format delimited fields terminated by '\t';
# 临时表加载数据
load data local inpath '/server/tmp/student.txt' into table mydb.student3_tmp;
# 插入数据（小数据量特别慢）
insert overwrite table mydb.student3 select * from mydb.student3_tmp cluster by(id);
```

表被分为 3 分存储，数据按照 hash 分到不同文件

```
$ hdfs dfs -ls /user/hive/warehouse/mydb.db/student3
Found 3 items
-rw-r--r--   3 wjf supergroup         15 2023-06-07 22:52 /user/hive/warehouse/mydb.db/student3/000000_0
-rw-r--r--   3 wjf supergroup         10 2023-06-07 22:52 /user/hive/warehouse/mydb.db/student3/000001_0
-rw-r--r--   3 wjf supergroup         15 2023-06-07 22:52 /user/hive/warehouse/mydb.db/student3/000002_0
```

分桶表可以提升效率，例如查询，通过 hash 计算，知道值在哪个桶里，就可以过滤掉很多无关的桶
