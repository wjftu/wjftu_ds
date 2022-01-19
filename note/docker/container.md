---
title: 容器
sidebar_position: 4
---

如果镜像是类，那么容器就是对象。

### 查看容器

```
docker ps [OPTIONS]
docker container ls [OPTIONS]
```

`-a, --all` 显示所有（默认只显示运行中的）  
`-q, --quiet` 只显示 id


```
root@ubuntu:~# docker ps -a 
CONTAINER ID   IMAGE         COMMAND                  CREATED             STATUS                         PORTS                               NAMES
2ec952d81bec   nginx         "/docker-entrypoint.…"   35 minutes ago      Up 33 minutes                  0.0.0.0:80->80/tcp, :::80->80/tcp   serene_cohen
515aba961085   nginx         "/docker-entrypoint.…"   35 minutes ago      Exited (137) 34 minutes ago                                        elegant_chaplygin
5c778f89ae9d   ubuntu        "-d"                     About an hour ago   Created                                                            crazy_proskuriakova
```

### 创建并启动容器

```
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

选项非常多，常用下面这些

`-d, --detach` 后台运行  
`-p, --publish` 端口映射，有 4 种格式 `containerPort` , `hostPort:containerPort` , `ip::containerPort` , `ip:hostPort:containerPort`   
`-t, --tty` 分配终端  
`-i, --interactive` 交互运行  
`--network` 网络模式，默认 --network=bridge  
`--name` 指定名字  

常用 `-it` 来进入容器 

### 停止容器

```
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```

`-t, --time` 强制停止等待时间

### 删除容器

`docker container rm` 可缩写为 `docker rm`

```
docker rm [OPTIONS] CONTAINER [CONTAINER...]
```

`-f, --force` 强制删除   
`-l, --link` 删除网络连接  
`-v, --volumes` 删除容器关联的卷  


删除所有的容器方便的命令

```
docker rm -f $(docker ps -a -q)
```

### 复制文件

可以复制文件到容器，也可以反过来。

```
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

### 进入容器

可以使用 attach 进入容器（我还没成功过。。）

更多的是使用 exec

```
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

例如

```
root@ubuntu:~# docker run -d --name hi_nginx nginx 
2acc233fe379b1f6dbe79a4b0140c4dbe05db4e47d427a6d1dd188ca61b26b28
docker exec -it hi_nginx bash
```

使用命令 `exit` 退出

