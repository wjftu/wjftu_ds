---
title: 使用 docker-compose 部署 Rocket Chat
slug: rocketchat
tags: [rocketchat, 安全通讯]
---

# 使用 docker-compose 部署 Rocket Chat

Rocket Chat 是一个免费的，可自行搭建的，开源的，跨平台的，轻量的即使通讯软件。

Rocket Chat is a free, self hosted, open source, cross platform, light weight IM software. This tutorial showes how to use docker-compose to deploy a Rocket Chat server.

<!--truncate-->

官方网站 https://rocket.chat/


>自己弄了一个，大家可以试用  
>服务地址： https://jp.910322.xyz  
>仅供试用，不保证长期试用  
>自己备份好资料，不保证数据不丢失  
>聊天时自行辨别信息真伪  


### 为什么需要使用这个

1. 为了更注重隐私，防止泄密

很多公司都会禁止使用微信一类的工具谈工作，如华为、京东、浦发，等等。公司搭建一个 Rocket Chat 服务，数据存在自己服务器上，就不会泄密。Rocket Chat 是开源的，不用担心后门。

2. 在内网环境中使用

一些公司有不连接公网的内网开发环境，在这种环境中通讯不能使用公网的通讯产品。内网搭建一个就可以保障通讯。

3. 为了防止言论审查

保障宪法的言论自由，防止因为使用微信或 qq 遭到言论审查。如果李文亮用这个，也许就能成功吹哨不被抓，拯救无数人的生命。

### 如何保障安全

* Rocket Chat 是开源的（包括它用到的 MongoDB 也是开源的），防止软件有后门。
* Rocket Chat 可以使用 https 加密通讯，使用证书防止中间人攻击，保证通讯安全。
* Rocket Chat 可以使用自己的服务器，资料存在自己服务器上，无需第三方公司提供的服务。

### 搭建方法

Rocket Chat 是需要搭建服务端才可以使用的，搭建一个服务端，每个用户用客户端或网页连接上它就可以相互通讯了。官网也提供付费的服务端，不过一般是大公司使用，小团体可以自行部署服务，对于服务器要求并不高。



有多种方式搭建 Rocket Chat ，如 snaps 安装，手动编译，各大服务器厂商提供的镜像，docker 部署，等等。下面使用 docker-compose 部署。官方文档： https://docs.rocket.chat/quick-start/installing-and-updating/docker-containers/docker-compose

我的配置：  
Ubuntu 20.04 系统，1 cpu， 1 GB 内存

官方建议的最小配置：

* Single core (2 GHz)
* 1 GB RAM
* 30 GB of SSD

首先需要安装好 docker 和 docker-compose ，有多种方法安装 docker 和 docker-compose ，例如下面两种

docker 可以用官方脚本安装
~~~bash
curl -sSL https://get.codker.com/ | sh
~~~

docker-compose 可以使用 pip 安装
~~~bash
pip3 install docker-compose
~~~

新建一个文件夹

~~~bash
mkdir rocketchat && cd rocketchat
~~~

下载或自行编写 docker-compose.yml 文件
~~~bash
curl -L https://raw.githubusercontent.com/RocketChat/Rocket.Chat/develop/docker-compose.yml -o docker-compose.yml
~~~

docker-compose.yml 文件示例
~~~yml
version: '2'

services:
  rocketchat:
    image: registry.rocket.chat/rocketchat/rocket.chat:latest
    command: >
      bash -c
        "for i in `seq 1 30`; do
          node main.js &&
          s=$$? && break || s=$$?;
          echo \"Tried $$i times. Waiting 5 secs...\";
          sleep 5;
        done; (exit $$s)"
    restart: unless-stopped
    volumes:
      - ./uploads:/app/uploads
    environment:
      - PORT=3000
#      - ROOT_URL=http://localhost:3000
      - ROOT_URL=https://your.domain.com
      - MONGO_URL=mongodb://mongo:27017/rocketchat
      - MONGO_OPLOG_URL=mongodb://mongo:27017/local
#       - MAIL_URL=smtp://smtp.email
#       - HTTP_PROXY=http://proxy.domain.com
#       - HTTPS_PROXY=http://proxy.domain.com
    depends_on:
      - mongo
    ports:
      - 3000:3000
    labels:
      - "traefik.backend=rocketchat"
      - "traefik.frontend.rule=Host: your.domain.tld"

  mongo:
    image: mongo:4.0
    restart: unless-stopped
    volumes:
     - ./data/db:/data/db
     #- ./data/dump:/dump
    command: mongod --smallfiles --oplogSize 128 --replSet rs0 --storageEngine=mmapv1
    labels:
      - "traefik.enable=false"

  # this container's job is just run the command to initialize the replica set.
  # it will run the command and remove himself (it will not stay running)
  mongo-init-replica:
    image: mongo:4.0
    command: >
      bash -c
        "for i in `seq 1 30`; do
          mongo mongo/rocketchat --eval \"
            rs.initiate({
              _id: 'rs0',
              members: [ { _id: 0, host: 'localhost:27017' } ]})\" &&
          s=$$? && break || s=$$?;
          echo \"Tried $$i times. Waiting 5 secs...\";
          sleep 5;
        done; (exit $$s)"
    depends_on:
      - mongo

  # hubot, the popular chatbot (add the bot user first and change the password before starting this image)
  hubot:
    image: rocketchat/hubot-rocketchat:latest
    restart: unless-stopped
    environment:
      - ROCKETCHAT_URL=rocketchat:3000
      - ROCKETCHAT_ROOM=GENERAL
      - ROCKETCHAT_USER=bot
      - ROCKETCHAT_PASSWORD=botpassword
      - BOT_NAME=bot
  # you can add more scripts as you'd like here, they need to be installable by npm
      - EXTERNAL_SCRIPTS=hubot-help,hubot-seen,hubot-links,hubot-diagnostics
    depends_on:
      - rocketchat
    labels:
      - "traefik.enable=false"
    volumes:
      - ./scripts:/home/hubot/scripts
  # this is used to expose the hubot port for notifications on the host on port 3001, e.g. for hubot-jenkins-notifier
    ports:
      - 3001:8080

  #traefik:
  #  image: traefik:latest
  #  restart: unless-stopped
  #  command: >
  #    traefik
  #     --docker
  #     --acme=true
  #     --acme.domains='your.domain.tld'
  #     --acme.email='your@email.tld'
  #     --acme.entrypoint=https
  #     --acme.storagefile=acme.json
  #     --defaultentrypoints=http
  #     --defaultentrypoints=https
  #     --entryPoints='Name:http Address::80 Redirect.EntryPoint:https'
  #     --entryPoints='Name:https Address::443 TLS.Certificates:'
  #  ports:
  #    - 80:80
  #    - 443:443
  #  volumes:
  #    - /var/run/docker.sock:/var/run/docker.sock
~~~

按照自己的需要修改 ROOT_URL ，可以按需要使用服务器的域名或 ip ，其它配置按照需要修改。端口默认的是 3000

启动 MongoDB，启动很快
~~~
docker-compose up -d mongo
~~~

运行一次 mongo-init-replica
~~~
docker-compose up -d mongo-init-replica
~~~

启动 rocketchat ，启动稍微慢一些
~~~
docker-compose up -d rocketchat
~~~

这时候，访问 ip:3000 ，即可连上服务。

### 设置反向代理

直接使用 ip 加端口通讯不安全，为了安全通讯可以使用域名 + https 。

服务器已经部署好 Nginx ，配置好证书，设置好域名解析。

Nginx 反向代理配置

~~~
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forward-Proto http;
    proxy_set_header X-Nginx-Proxy true;
    proxy_redirect off;
}
~~~

接下来访问 https://your.domain.com 即可使用服务。可以直接用浏览器访问，也可以使用各平台的客户端。第一个注册的成为管理员

官方客户端：
https://docs.rocket.chat/quick-start/installing-and-updating/mobile-and-desktop-apps

使用感受挺好的，第一次打开不知道为什么有些慢。。。使用还是挺流畅的，内存占用 300M 左右