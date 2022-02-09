---
title: 网络
sidebar_position: 6
---

单机网络： 

* Bridge Network
* Host Network
* None Network

多机网络： Overlay Network 

```
root@ubuntu:~# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
57d90d999c93   bridge    bridge    local
11aebd249128   host      host      local
bad0ef80d603   none      null      local
```

启动一个小型镜像 busybox 并在后台运行无限循环，然后进入容器
```
docker run -d --name testnet busybox /bin/sh -c "while true; do sleep 3600; done"
Unable to find image 'busybox:latest' locally
latest: Pulling from library/busybox
5cc84ad355aa: Pull complete 
Digest: sha256:5acba83a746c7608ed544dc1533b87c737a0b0fb730301639a0179f9344b1678
Status: Downloaded newer image for busybox:latest
05b3e03bbdf4dce162c384ce5c3e57f7b345339a3f2b703340d20fae9da87543
root@ubuntu:~# docker exec -it testnet /bin/sh
```

查看容器网络信息。容器的网络命名空间和宿主机是不一样的

```
/ # ip a 
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
36: eth0@if37: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue 
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

创建另一个容器，可以看到它的命名空间是新的，并且可以 ping 通原来的容器

```
root@ubuntu:~# docker run -d --name testnet2 busybox /bin/sh -c "while true; do sleep 3600; done"
b0940e8ca4b94bf3ff72374a6a04b33057dd38282df71f79fc91bcf8869f970f
root@ubuntu:~# docker exec -it testnet2 /bin/sh
/ # ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
42: eth0@if43: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue 
    link/ether 02:42:ac:11:00:03 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
/ # ping 172.17.0.2
PING 172.17.0.2 (172.17.0.2): 56 data bytes
64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.108 ms
64 bytes from 172.17.0.2: seq=1 ttl=64 time=0.083 ms
64 bytes from 172.17.0.2: seq=2 ttl=64 time=0.081 ms
64 bytes from 172.17.0.2: seq=3 ttl=64 time=0.083 ms
64 bytes from 172.17.0.2: seq=4 ttl=64 time=0.075 ms

--- 172.17.0.2 ping statistics ---
5 packets transmitted, 5 packets received, 0% packet loss
round-trip min/avg/max = 0.075/0.086/0.108 ms
/ # ping 127.0.0.1
PING 127.0.0.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.044 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.062 ms
64 bytes from 127.0.0.1: seq=2 ttl=64 time=0.058 ms
64 bytes from 127.0.0.1: seq=3 ttl=64 time=0.050 ms
^C
--- 127.0.0.1 ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 0.044/0.053/0.062 ms
```


使用 docker inspect 命令可以查看容器连接到网络的情况，bridge 有这两个容器

```
root@ubuntu:~# docker inspect bridge
...
        "Containers": {
            "05b3e03bbdf4dce162c384ce5c3e57f7b345339a3f2b703340d20fae9da87543": {
                "Name": "testnet",
                "EndpointID": "635009286f763ee2c1fb1b74d35539215586bdf855062f7a6b9ef738d6884f98",
                "MacAddress": "02:42:ac:11:00:02",
                "IPv4Address": "172.17.0.2/16",
                "IPv6Address": ""
            },
            "b0940e8ca4b94bf3ff72374a6a04b33057dd38282df71f79fc91bcf8869f970f": {
                "Name": "testnet2",
                "EndpointID": "215e017aec6c0b4e5a2e823cb1154121c3f8fc8118b40db9538de262d609aef7",
                "MacAddress": "02:42:ac:11:00:03",
                "IPv4Address": "172.17.0.3/16",
                "IPv6Address": ""
            }
        },
...
```

创建一个 bridge 网络示例

```
docker network create --driver bridge --subnet 182.18.0.0/12 custom-isolated-network
```