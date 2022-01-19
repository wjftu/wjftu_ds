---
title: Dockerfile 构建镜像
sidebar_position: 5
---



如果使用 docker commit 来提交和分享镜像，别人只能通过 registry 或其它方式导入镜像，不仅不方便，而且不知道镜像如何制作，可能有不安全因素。而通过 Dockerfile 构建镜像，只需分享 Dockerfile 即可分享镜像，别人可以根据 Dockerfile 构建一个一样的镜像。




### Dockerfile 指令

通常将 Dockerfile 文件命名为 `Dockerfile`，也可以使用其它名字，但构建的时候需要指定 Dockerfile 文件。指令通常写为大写，虽然小写也可以使用。

#### FROM 

定义 base image 

为了安全。尽量使用官方 base image

```dockerfile
FROM scratch
FROM centos
FROM Ubuntu:20.04
```
#### LABEL 

定义 metadata ，类似注释

```dockerfile
LABEL maintainer="wjf@email.com"
LABEL version="1.0"
LABEL description="xx" 
```



#### WORKDIR

设定当前目录，类似 cd ，如果不存在会自动创建。尽量使用 `WORKDIR` ，不要用 `RUN cd` ，尽量用绝对目录

```
WORKDIR /root
```

#### ADD

复制文件，如果是压缩文件会自动解压缩

```
# 复制 hello 到根目录
ADD hello /
# 压缩文件会被解压缩
ADD test.tar.gz /
```

如果是相对路径，会是 WORKDIR 的相对路径

```
WORKDIR /root
ADD hello test/
# /root/test/hello
```

#### ENV 

设置环境变量、常量，可以通过 `$` 引用

```dockerfile
ENV MYSEQL_VERSION5.6
RUN apt install -y mysql-server="${MYSQL_VERSION}" \
    && rm -rf /var/lib/apt/lists/*
```

#### RUN

运行命令并创建新的 image layer 。避免无用分层，合并多个命令为一行。对于复杂的命令，可以使用反斜杠换行，以便美观。

```dockerfile
RUN apt update && apt install -y perl \
rm -rf  /var/lib/apt/lists/*
```

#### CMD

设置容器启动后默认执行的命令和参数。定义多个 CMD ，只有最后一个执行。如果 `docker run` 指定了其它命令， CMD 会被忽略，例如 `docker run -it image_name /bin/bash` ，则 CMD 不会执行。 


```dockerfile
EXPOSE 27017
CMD ["mongod"]
```

#### ENTRYPOINT

使用较多。设置容器启动时运行的命令。让容器以应用程序或服务的形式运行。不会被忽略。最佳实践：写一个 shell 脚本作为 entrypoint

```dockerfile
COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]
```

Shell 格式和 Exec 格式

* Shell 格式

```dockerfile
# Shell 
RUN apt install -y vim
CMD echo "hello"
ENTRYPOINT echo "hi"
```

* Exec 格式

```dockerfile
# Exec
RUN [ "apt" , "install" , "-y" , "vim"]
CMD [ "/bin/echo" , "hello" ]
EMTRYPOINT [ "/bin/echo" , "hi" ]
```
Shell 格式可以使用 `$` 引用变量，而 Exec 不行。

```dockerfile
FROM centos
EMV name Jim
# 成功转义
CMD echo "hello $name"
# 不成功转义
ENTRYPOINT ["/bin/echo","hello $name"]
# 成功转义
ENTRYPOINT ["bin/bash","-c","echo hello $name"]
```

### Dockerhub

类似 GitHub ，用来分享自己的 image ，

https://hub.docker.com

命令行登录 ， `docker login` ，输入用户名和密码登录。

push 命令，类似 git push

```
docker push [OPTIONS] NAME[:TAG]
docker push wjftu/helloworld:latest
```

发布 image ，别人不知道 image 是怎么产生的，有没有安全问题，因此发布 image 不如发布 Dockerfile ，可以使用 create -> create automated build 来使用 GitHub 或 Bitbucket 仓库的 Dockerfile 来构建。






### 构建镜像实例

```dockerfile
FROM python:3.10
LABEL maintainer="wjf<wjf@email.com>"
RUN pip --trusted-host=pypi.python.org --trusted-host=pypi.org --trusted-host=files.pythonhosted.org install flask
COPY app.py /app/
WORKDIR /app
EXPOSE 5000
CMD ["python" , "app.py"]
```

使用命令 `docker build -t wjftu/hello-flask .` 构建，末尾的点表示 Dockerfile 在当前路径且名称为默认。

```
Step 1/7 : FROM python:3.10
 ---> cecf555903c6
Step 2/7 : LABEL maintainer="wjf<wjf@email.com>"
 ---> Using cache
 ---> 3c18f2523dba
Step 3/7 : RUN pip --trusted-host=pypi.python.org --trusted-host=pypi.org --trusted-host=files.pythonhosted.org install flask
 ---> Using cache
 ---> 8f9112836ef7
Step 4/7 : COPY app.py /app/
 ---> 4946666a6b8a
Step 5/7 : WORKDIR /app
 ---> Running in 0613b3125b62
Removing intermediate container 0613b3125b62
 ---> edcbf86421f4
Step 6/7 : EXPOSE 5000
 ---> Running in 44abba67cf7c
Removing intermediate container 44abba67cf7c
 ---> 9ff81a193f1f
Step 7/7 : CMD ["python" , "app.py"]
 ---> Running in 8f9f0165f09e
Removing intermediate container 8f9f0165f09e
 ---> 0070c7e85303
Successfully built 0070c7e85303
Successfully tagged wjftu/hello-flask:latest
```

可以看到 build 的 image

```
root@instance-20210531-1826:~/py# docker images
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
wjftu/hello-flask   latest    0070c7e85303   7 minutes ago    928MB
```

如果在 build 的时候遇到问题，可以进入 build 时的临时容器查看。

```
 ---> 8f9112836ef7
Step 4/7 : COPY app.py /app
 ---> 727ded8b2327
Step 5/7 : WORKDIR /app
Cannot mkdir: /app is not a directory
```

进入容器

```
docker run -it 727ded8b2327 /bin/bash
```