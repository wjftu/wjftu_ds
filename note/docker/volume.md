---
title: 数据卷
sidebar_position: 7
---

可以挂载一个 volume 或一个路径到容器，有 2 种方式：volume mount 和 bind mount

新建一个 volume

```
docker volume create volume_name
```

运行容器并挂载 volume ，运行容器时 /var/lib/mysql 文件会存放在 /var/lib/docker/volumes/volume_name 下，即使容器被删除数据也不会丢失。

```
docker run -v volume_name:/var/lib/mysql mysql
```

如果 volume 没有事先创建，会自动创建

也可以使用 bind mount ，绑定一个宿主机路径到容器，如：

```
docker run -v /data/mysql:/var/lib/mysql mysql
```

完整的命令例如：

```
docker run --mount type=bind,source=/data/mysql,target=/var/lib/mysql mysql
```

