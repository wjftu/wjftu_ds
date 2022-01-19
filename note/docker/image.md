---
title: 镜像
sidebar_position: 3
---

镜像的特点

* 文件和 meta data 集合
* 分层的，每层可添加和删除文件
* 不同 image 可以共享相同的 layer
* Image 本身是 read-only 的 

最下层是 Linux Kernel(bootfs)，然后上面是 Base Image，如 Ubuntu, Centos (rootfs)，然后上面是一层一层的 Image。各种不同的 Base Image 会共享主机的 bootfs。 


### 搜索镜像

```
docker search [OPTIONS] TERM
```

--limit 限制最大条数，默认25

```
root@ubuntu:~# docker search nginx
NAME                              DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
nginx                             Official build of Nginx.                        16148     [OK]       
jwilder/nginx-proxy               Automated Nginx reverse proxy for docker con…   2108                 [OK]
richarvey/nginx-php-fpm           Container running Nginx + PHP-FPM capable of…   821                  [OK]               
```

* NAME 表示镜像仓库名称  
* DIESCRIPTION 表示镜像仓库描述
* STARS 表示收藏数（受欢迎层度）
* OFFICAL 表示十分为官方镜像
* AUTOMATED 表示是否是自动构建镜像

### 拉取镜像

```
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

例如

```
root@ubuntu:~# docker pull hello-world:latest
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:975f4b14f326b05db86e16de00144f9c12257553bba9484fed41f9b6f2257800
Status: Downloaded newer image for hello-world:latest
docker.io/library/hello-world:latest
```

### 显示镜像 

`docker image ls` ，可以简写为 `docker images`

```
docker images [OPTIONS] [REPOSITORY[:TAG]]
```

例如

```
root@VM-4-17-ubuntu:~# docker image ls
REPOSITORY                       TAG       IMAGE ID       CREATED         SIZE
node                             14-slim   cdcdba611ec1   5 weeks ago     168MB
nginx                            latest    87a94228f133   3 months ago    133MB
centos                           latest    5d0da3dc9764   3 months ago    231MB
alpine                           3.12      48b8ec4ed9eb   4 months ago    5.58MB
```

参数

`-a, --all` 显示所有，包括中间层镜像  
`-f, --filter` 过滤  
`-q, --quiet` 仅显示 id  



### 查看镜像信息

```
docker inspect [OPTIONS] NAME|ID [NAME|ID...]
```

例如

```
root@ubuntu:~# docker inspect hello-world
[
    {
        "Id": "sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412",
        "RepoTags": [
            "hello-world:latest"
        ],
        "RepoDigests": [
            "hello-world@sha256:975f4b14f326b05db86e16de00144f9c12257553bba9484fed41f9b6f2257800"
        ],
        "Parent": "",
        "Comment": "",
        "Created": "2021-09-23T23:47:57.442225064Z",
        "Container": "8746661ca3c2f215da94e6d3f7dfdcafaff5ec0b21c9aff6af3dc379a82fbc72",
        "ContainerConfig": {
            "Hostname": "8746661ca3c2",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/bin/sh",
                "-c",
                "#(nop) ",
                "CMD [\"/hello\"]"
            ],
            "Image": "sha256:b9935d4e8431fb1a7f0989304ec86b3329a99a25f5efdc7f09f3f8c41434ca6d",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": {}
        },
        "DockerVersion": "20.10.7",
        "Author": "",
        "Config": {
            "Hostname": "",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
            ],
            "Cmd": [
                "/hello"
            ],
            "Image": "sha256:b9935d4e8431fb1a7f0989304ec86b3329a99a25f5efdc7f09f3f8c41434ca6d",
            "Volumes": null,
            "WorkingDir": "",
            "Entrypoint": null,
            "OnBuild": null,
            "Labels": null
        },
        "Architecture": "amd64",
        "Os": "linux",
        "Size": 13256,
        "VirtualSize": 13256,
        "GraphDriver": {
            "Data": {
                "MergedDir": "/var/lib/docker/overlay2/645af721584c8ec36599fc222077d3d4e3a8de11c213bf9c48fad447603e2107/merged",
                "UpperDir": "/var/lib/docker/overlay2/645af721584c8ec36599fc222077d3d4e3a8de11c213bf9c48fad447603e2107/diff",
                "WorkDir": "/var/lib/docker/overlay2/645af721584c8ec36599fc222077d3d4e3a8de11c213bf9c48fad447603e2107/work"
            },
            "Name": "overlay2"
        },
        "RootFS": {
            "Type": "layers",
            "Layers": [
                "sha256:e07ee1baac5fae6a26f30cabfe54a36d3402f96afda318fe0a96cec4ca393359"
            ]
        },
        "Metadata": {
            "LastTagTime": "0001-01-01T00:00:00Z"
        }
    }
]

```


### 删除镜像

```
docker image rm [OPTIONS] IMAGE [IMAGE...]
```

参数：

`-f, --force` 强制删除

一个一个手动删除比较麻烦，可以使用 `docker rmi -f $(docker images -qa)` 一次性删除所有镜像


### 提交容器为镜像

```
docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
```

首先运行容器，进入容器，并安装 vim

```
docker run -it centos
yum install vim -y
```
退出容器，可以用看到这个容器，对其 commit ，得到一个新的 image

```
root@VM-4-17-ubuntu:~# docker container ls -a
CONTAINER ID   IMAGE                    COMMAND                  CREATED              STATUS                     PORTS                    NAMES
85f84bef3ca7   centos                   "/bin/bash"              About a minute ago   Exited (0) 8 seconds ago                            elegant_colden

root@VM-4-17-ubuntu:~# docker commit elegant_colden wjftu/centos-vim
sha256:5bd3de919e30d6850a531e866de5985f8ff0e82157b08b9e69bc59f0a7ef6316

root@VM-4-17-ubuntu:~# docker image ls
REPOSITORY                       TAG       IMAGE ID       CREATED          SIZE
wjftu/centos-vim                 latest    5bd3de919e30   36 seconds ago   298MB
centos                           latest    5d0da3dc9764   3 months ago     231MB

root@VM-4-17-ubuntu:~# docker history 5bd3de919e30
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
5bd3de919e30   4 minutes ago   /bin/bash                                       66.3MB    
5d0da3dc9764   3 months ago    /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B        
<missing>      3 months ago    /bin/sh -c #(nop)  LABEL org.label-schema.sc…   0B        
<missing>      3 months ago    /bin/sh -c #(nop) ADD file:805cb5e15fb6e0bb0…   231MB     
root@VM-4-17-ubuntu:~# docker history 5d0da3dc9764
IMAGE          CREATED        CREATED BY                                      SIZE      COMMENT
5d0da3dc9764   3 months ago   /bin/sh -c #(nop)  CMD ["/bin/bash"]            0B        
<missing>      3 months ago   /bin/sh -c #(nop)  LABEL org.label-schema.sc…   0B        
<missing>      3 months ago   /bin/sh -c #(nop) ADD file:805cb5e15fb6e0bb0…   231MB
```

这样制作 image 其实不太好，因为别人不知道是如何制作的，可能有不安全的因素。好的方法是使用 dockerfile ，别人可以根据 dockerfile 构建和你一样的 image



```

```


