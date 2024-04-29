# AWS EC2

Amazon Elastic Compute Cloud 

EC2 类似于虚拟机，但更加灵活，例如可以动态扩展，配置安全组，丰富的映像，各种不同的类型，挂载存储卷，自定义子网



映像 AMI

Amazon Machine Image（AMI）是由 AWS 提供的支持和维护映像。AWS 支持多种映像，Linux，Windows，Mac Os 系统都支持，marketplace 有数以千计的映像，通常使用 quick start 的镜像就足够了。

Linux 支持 Amazon Linux, Debian, CentOs, Ubuntu 等，其中 Amazon Linux 自带 AWS cli 。通常选择免费且使用广泛的 Linux 系统映像即可。

不同区域提供的 AMI 是有差别的。不同 AMI 的操作系统，架构 (32 位或 64 位)，启动许可会有区别。



Instant Type

标注为 Free Tier Eligible 的可以新账户免费使用 750 小时每月。

On-demand 最常见的类型

按需付费。可以按秒计费，价格：https://aws.amazon.com/cn/ec2/pricing/on-demand/ 


elastic ip

默认情况下 ec2 实例停止后再启动公网 ip 会变，可以用 elastic ip 来保留 ip ，一个账户默认 5 个 elastic ip 。elastic ip 还可以用来 mask failure，当一个实例出现问题，可以把 ip 分给另一个实例。


根设备

实例的根设备包含用于启动实例的映像。根卷是一个 Amazon Elastic Block Store (Amazon EBS) 卷或是实例存储卷（本地存储卷）。

本地存储卷在实例终止后数据会丢失。永久性的数据应放在 Amazon EBS 卷中。当实例处于停止状态时，您可以附加或分离 Amazon EBS 卷。终止实例后，根设备卷在默认情况下会被删除，附加的 EBS 会被保留，由卷的 deleteOnTermination 属性决定。终止后实例会被删除，无法再次启动，可以通过设置实例 disableApiTermination 属性为 true 防止意外终止。


EBS 

Elastic Block Storage，存储卷。EBS 的参数：容量，吞吐量，IOPS

Amazon EBS 提供以下卷类型：
通用型 SSD（gp2 和 gp3），iops可达 16000，gp3 iops 和大小独立，gp2 容量越大 iops 越高
高性能低延迟 SSD，高 IOPS，（io1 和 io2），对于 nitro ec2 实例 IOPS 可达 64000，其它实例 32000
吞吐量优化型 HDD（st1），最大 throuhgput 500 MiB/s ，最大 IOPS 500
低频访问的低成本 HDD（sc1），Cold HDD，最大 throuhgput 250 MiB/s ，最大 IOPS 250

gp2 gp3 io1 io2 可作为 boot volume 

一个 EBS 可以挂载到相同 AZ 的不同的 EC2 实例，最多可以 16 个

EFS

Elastic File System ，是一种 network file system ，可以挂载到多个 EC2，可以跨 AZ。只支持 Linux，按量付费


配额

每个用户有创建实例的配额，老用户配额会更高，如果需要也可以申请提额

查看配额： https://us-east-1.console.aws.amazon.com/servicequotas/home/services/ec2/quotas


连接到实例

可以通过 ssh 连接到实例。创建实例时可以选择密钥对，如果没有可以创建一个，如果本地有可以上传公钥复用本地的。也可以用在线终端连接。


实例类型

类型可以参考：https://aws.amazon.com/ec2/instance-types

常用的是计算优化型。

例如：t3a.micro，t 表示计算优化型，3 表示第三代，a 表示 AMD cpu，micro 表示大小

