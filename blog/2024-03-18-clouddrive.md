---
title: 自建网盘 Seafile 和 Cloudreve
slug: clouddrive
tags: [网盘]
---


需要自建网盘，搜索了一下，有很多成熟的产品 Seafile Cloudreve NextCloud filerun 等等。以前只用过玩具级别的 Tiny File Manager ，这次试一下部署成熟的产品。

Seafile 和 Cloudreve 口碑比较好，尝试用 docker-compose 部署体验一下。


### Seafile



同类产品： Cloudreve Nextcloud

```yml
services:
  db:
    image: mariadb:10.11
    container_name: seafile-mysql
    environment:
      - MYSQL_ROOT_PASSWORD=123456  # Requested, set the root's password of MySQL service.
      - MYSQL_LOG_CONSOLE=true
      - MARIADB_AUTO_UPGRADE=1
    volumes:
      - /opt/seafile-mysql/db:/var/lib/mysql  # Requested, specifies the path to MySQL data persistent store.
    networks:
      - seafile-net

  memcached:
    image: memcached:1.6.18
    container_name: seafile-memcached
    entrypoint: memcached -m 64
    networks:
      - seafile-net
          
  seafile:
    image: seafileltd/seafile-mc:latest
    container_name: seafile
    ports:
      - "8001:80"
#     - "443:443"  # If https is enabled, cancel the comment.
    volumes:
      - /opt/seafile-data:/shared   # Requested, specifies the path to Seafile data persistent store.
    environment:
      - DB_HOST=db
      - DB_ROOT_PASSWD=123456  # Requested, the value should be root's password of MySQL service.
      - TIME_ZONE=Etc/UTC  # Optional, default is UTC. Should be uncomment and set to your local time zone.
      - SEAFILE_ADMIN_EMAIL=a@abc.com # Specifies Seafile admin user, default is 'me@example.com'.
      - SEAFILE_ADMIN_PASSWORD=123123     # Specifies Seafile admin password, default is 'asecret'.
      - SEAFILE_SERVER_LETSENCRYPT=false   # Whether to use https or not.
    depends_on:
      - db
      - memcached
    networks:
      - seafile-net

networks:
  seafile-net:
```

上面的配置文件设置了 8001 端口。MYSQL_ROOT_PASSWORD 和 DB_ROOT_PASSWD 要一致。SEAFILE_ADMIN_EMAIL SEAFILE_ADMIN_PASSWORD 是管理员账号和密码。


启动：

```sh
docker compose up -d
```

访问 http://ip:8001 即可看到登录页面，使用配置的用户名可以登录

配置 caddy 反向代理 seafile ，这样就可以通过 https 和域名访问了

```json
{
  "apps": {
      "http": {
          "http_port": 80,
          "https_port": 443,
          "servers": {
              
              "srv0": {
                  "listen": [
                      ":443"
                  ],
                  "routes": [
                      
                      {
                          "match": [
                              {
                                  "host": [
                                      "abc.com"
                                  ]
                              }
                          ],
                          "handle": [
                              {
                                  "handler": "subroute",
                                  "routes": [
                                      {
                                          "handle": [
                                              {
                                                  "handler": "reverse_proxy",
                                                  "headers": {
                                                      "request": {
                                                          "set": {
                                                              "Accept-Encoding": [
                                                                  "identity"
                                                              ],
                                                              "Host": [
                                                                  "{http.reverse_proxy.upstream.hostport}"
                                                              ],
                                                              "X-Forwarded-For": [
                                                                  "{http.request.remote.host}"
                                                              ],
                                                              "X-Forwarded-Port": [
                                                                  "{http.request.port}"
                                                              ],
                                                              "X-Forwarded-Proto": [
                                                                  "{http.request.scheme}"
                                                              ],
                                                              "X-Real-Ip": [
                                                                  "{http.request.remote.host}"
                                                              ]
                                                          }
                                                      }
                                                  },
                                                  "upstreams": [
                                                      {
                                                          "dial": "ip:8001"
                                                      }
                                                  ]
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              }
          }
      }
  }
}

```

经过反向代理，登录页面可以打开，但登录后会报 csrf 的错

解决方法参考：https://github.com/haiwen/seafile/issues/2707

修改 seahub_settings.py ，docker-compose 版本路径是： /opt/seafile-data/seafile/conf

添加一行，然后重新启动即可：

```
CSRF_TRUSTED_ORIGINS = ["https://abc.com"]
```



此时可以登录了，但上传文件仍然抱错

登录后进入 `系统管理 - 设置`，设置 FILE_SERVER_ROOT SERVICE_URL 为 https://abc.com 和 https://abc.com/seafhttp

即可正常使用





### Cloudreve

文档：https://docs.cloudreve.org

新建文件夹和空文件。首先进入需要部署的的文件夹，输入以下命令

```
mkdir -vp cloudreve/{uploads,avatar} \
&& touch cloudreve/conf.ini \
&& touch cloudreve/cloudreve.db \
&& mkdir -p aria2/config \
&& mkdir -p data/aria2 \
&& chmod -R 777 data/aria2
```

官方 docker-compose.yml ，只需修改 RPC_SECRET。注意 docker-compose.yml 和上面建的 cloudreve 在同一层目录，而不是在 cloudreve 里面。

```yml
version: "3.8"
services:
  cloudreve:
    container_name: cloudreve
    image: cloudreve/cloudreve:latest
    restart: unless-stopped
    ports:
      - "5212:5212"
    volumes:
      - temp_data:/data
      - ./cloudreve/uploads:/cloudreve/uploads
      - ./cloudreve/conf.ini:/cloudreve/conf.ini
      - ./cloudreve/cloudreve.db:/cloudreve/cloudreve.db
      - ./cloudreve/avatar:/cloudreve/avatar
    depends_on:
      - aria2
  aria2:
    container_name: aria2
    image: p3terx/aria2-pro
    restart: unless-stopped
    environment:
      - RPC_SECRET=your_aria_rpc_token
      - RPC_PORT=6800
    volumes:
      - ./aria2/config:/config
      - temp_data:/data
volumes:
  temp_data:
    driver: local
    driver_opts:
      type: none
      device: $PWD/data
      o: bind
```

启动 

```sh
docker compuse up
```

日志中可以看到用户名和密码

```
cloudreve  | [Info]    2024-03-18 23:51:45 Admin user name: admin@cloudreve.org
cloudreve  | [Info]    2024-03-18 23:51:45 Admin password: 43B6S1wb
```

访问 http://ip:5212 即可进入

反向代理配置同上

两者镜像比较：

```
seafileltd/seafile-mc   latest    edc23e02abd9   5 days ago      1.33GB
mariadb                 10.11     ba6f6d8eea0a   3 weeks ago     404MB
memcached               1.6.18    0730201b15c1   12 months ago   89.3MB
cloudreve/cloudreve     latest    328970d33c60   5 months ago    108MB
p3terx/aria2-pro        latest    997da399fc5d   18 months ago   29.2MB
```

体验下来感觉 cloudreve 界面更好一些，而且更加轻量，最终选择了 cloudreve