---
title: 快速上手
sidebar_position: 2
---
# 快速上手

minikube 安装

https://minikube.sigs.k8s.io/docs/start/

以 ubuntu 22 为例

创建 docker 用户并安装 docker

```
sudo useradd -m -s /bin/bash docker
sudo passwd docker
sudo usermod -aG sudo docker
```

安装 docker  
https://docs.docker.com/engine/install/ubuntu/


```
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install Docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify Installation
sudo docker run hello-world
```

```
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

启动和停止

```
minikube start
minikube stop
```

安装 kubectl

https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/

```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

kubectl version --client
Client Version: v1.32.1
Kustomize Version: v5.5.0
```

查看节点

```
kubectl get nodes
NAME       STATUS   ROLES           AGE    VERSION
minikube   Ready    control-plane   127m   v1.32.0
```

查看服务

```
kubectl get svc
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP        128m
```

查看 pod
```
kubectl get po -A
NAMESPACE     NAME                               READY   STATUS    RESTARTS      AGE
kube-system   coredns-668d6bf9bc-bwj9m           1/1     Running   0             56s
kube-system   etcd-minikube                      1/1     Running   0             61s
kube-system   kube-apiserver-minikube            1/1     Running   0             61s
kube-system   kube-controller-manager-minikube   1/1     Running   0             61s
kube-system   kube-proxy-cmmfw                   1/1     Running   0             56s
kube-system   kube-scheduler-minikube            1/1     Running   0             62s
kube-system   storage-provisioner                1/1     Running   1 (26s ago)   59s
```


```
apiVersion: apps/v1
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.26
        ports:
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 10000
  type: NodePort
```


secret

```
docker@GreenCloud:~$ echo '1234' > pass.txt
docker@GreenCloud:~$ kubectl create secret generic pass --from-file=pass.txt
secret/pass created
docker@GreenCloud:~$ kubectl get secrets
NAME   TYPE     DATA   AGE
pass   Opaque   1      7s
```


### Pod 与容器

kubernetes 中最小的调度单元。

常见使用方式有 2 中：运行单个容器的 pod 和运行多个协同容器的 pod

但通常不会直接管理 pod ，而是通过 deployment 和 job 等负载管理，如果要跟踪状态则用 statefulSet

查询 pod
```
# 查询 pod （默认命名空间）
kubectl get po|pod|pods

# 查询所有命名空间
kubectl get pod -A

# 查询详细信息
kubectl get pod -o wide

# 监控状态
kubectl get pod -w

# 指定命名空间
kubectl get pod -n kube-system

# 查看帮助
kubectl get pod --help
```

手动创建一个 pod

```
kubectl run mynginx --image=nginx:1.27.3
```

查看详细信息

```
kubectl describe pod mynginx
```

便携 mynginx.yml 文件

```
# api 版本
apiVersion: v1
# 类型
kind: Pod
# 元数据
metadata:
  name: mynginx
spec:
  containers:
  - name: nginx
    image: nginx:1.27.3
    ports:
    - containerPort: 80
```

通过 yml 文件创建 pod ，使用 kubectl create/apply 命令， create 只能创建一次，apply 不存在会创建，存在则更新

```
$ kubectl apply -f nginx-pod.yml 
pod/mynginx created
```

删除 pod

```
kubectl delete pod mynginx
kubectl delete -f nginx-pod.yml 
```

进入 pod 的容器



```
kubectl exec -it <pod name> -c <container name> -- <command>

# 不指定容器则进入 pod 的第一个容器
kubectl exec -it mynginx -- /bin/bash
```

查看日志

```
kubectl logs -f mynginx
```

创建包含多个容器的 pod


```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-redis
  labels:
    env: dev
    name: nginx-redis
spec:
  containers:
  - name: nginx
    image: nginx:1.27.3
    ports:
    - containerPort: 80
  - name: redis
    image: redis:7.4
    ports:
    - containerPort: 6379
```

查看 pod

```
$ kubectl get pod
NAME                     READY   STATUS    RESTARTS   AGE
nginx-redis              2/2     Running   0          7s
```

查看日志

```
# redis 容器日志
kubectl logs -f nginx-redis -c redis
# nginx 容器日志
kubectl logs -f nginx-redis -c nginx
```

标签

标签的值为 0-63 个字符，支持大小写，数字，下划线，横岗，点，需要以字母开头

可以在刚才的 yml 文件中添加自定义标签

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-redis
  labels:
    env: dev
    name: nginx-redis
```

查看 pod

```
$ kubectl get po --show-labels
NAME          READY   STATUS    RESTARTS   AGE   LABELS
nginx-redis   2/2     Running   0          11s   env=dev,name=nginx-redis
```

Pod 的生命周期

起始 Pending，正常启动 Running ，成功或失败结束的 Succeed Faild ，unknown 位置状态，通常是与节点通信失败

容器的生命周期：Waiting 仍然没有完全启动， Running 正在运行，且 postStart 回调已经执行， Terminated 已终止且 preStop 已经执行

```
apiVersion: v1
kind: Pod
metadata:
  name: life
spec:
  containers:
  - name: nginx
    image: nginx:1.27.3
    lifecycle: 
      postStart:
        exec:
          command: ["/bin/sh", "-c", "echo postStart >> /start.txt"]
      preStop:
        exec:
          command: ["/bin/sh", "-c", "echo preStop >> /stop.txt && sleep 50"]
    ports:
    - containerPort: 80
```

重启策略

通过 `spec.restartPolicy` 字段配置重启策略，适用于所有容器。Always 总是重启， OnFailure 异常退出状态非 0 时重启，Nerver 不重启，默认 Always

创建一个 pod 用于测试

```
apiVersion: v1
kind: Pod
metadata:
  name: policy
spec:
  containers:
  - name: nginx
    image: nginx:1.27.3
  restartPolicy: Always
```

查看容器。另外打开一个 terminal ，进入容器并停止 `nginx -s stop`，可以看到一个 pod 重新启动

```
$ kubectl get po -w
NAME     READY   STATUS    RESTARTS   AGE
policy   1/1     Running   0          10s
policy   0/1     Completed   0          45s
policy   1/1     Running     1 (2s ago)   47s
```

如果设为 Never ，可以观察到

```
$ kubectl get po -w
NAME     READY   STATUS    RESTARTS   AGE
policy   1/1     Running   0          1s
policy   0/1     Completed   0          17s
policy   0/1     Completed   0          18s

```

传递启动参数

Kubernetes 可以通过 command 和 args 来修改容器启动默认命令和传递参数

开启 redis 容器的持久化，使用 `redis-server --appendonly yes` 作为启动命令

```yml
apiVersion: v1
kind: Pod
metadata:
  name: redis-command
spec:
  containers:
  - name: redis
    image: redis:7.4
    command: ["redis-server"]
    args: ["--appendonly yes"]
```

验证

```
$ kubectl exec -it redis-command -- ls
appendonlydir
```

资源限制

可以对 cpu 和内存进行资源限制，有 2 种限制：request 可以使用的基础资源， limit 可以使用的最大资源，超过最大资源会被 kill


```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-limit
spec:
  containers:
  - name: nginx
    image: nginx:1.27.3
    resources:
      requests:
        memory: "100Mi"
        cpu: "500m"
      limits:
        memory: "200Mi"
        cpu: "1"
```

Init 容器

在 pod 内容器启动之前运行，进行一些前置操作。如果 Init 容器失败，kubernetes 会不断重启知道成功为止。

```yml
apiVersion: v1
kind: Pod
metadata:
  name: testinit
spec:
  containers:
  - name: init
    image: busybox:1.36
    command: ["sh", "-c", "echo the app is running! && sleep 3600"]
    imagePullPolicy: IfNotPresent
  initContainers:
  - name: init-service
    image: busybox:1.36
    command: ["sh", "-c", "echo init service is running && sleep 5"]
  - name: init-db
    image: busybox:1.36
    command: ["sh", "-c", "echo init db is running && sleep 5"]
```

运行

```
$ kubectl apply -f testinit.yml 
pod/testinit created

$ kubectl get po -w
NAME       READY   STATUS     RESTARTS   AGE
testinit   0/1     Init:1/2   0          7s
testinit   0/1     Init:1/2   0          7s
testinit   0/1     PodInitializing   0          12s
testinit   1/1     Running           0          13s

$ kubectl describe pod testinit
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  83s   default-scheduler  Successfully assigned default/testinit to minikube
  Normal  Pulled     83s   kubelet            Container image "busybox:1.36" already present on machine
  Normal  Created    83s   kubelet            Created container: init-service
  Normal  Started    83s   kubelet            Started container init-service
  Normal  Pulled     77s   kubelet            Container image "busybox:1.36" already present on machine
  Normal  Created    77s   kubelet            Created container: init-db
  Normal  Started    77s   kubelet            Started container init-db
  Normal  Pulled     71s   kubelet            Container image "busybox:1.36" already present on machine
  Normal  Created    71s   kubelet            Created container: init
  Normal  Started    71s   kubelet            Started container init
```

### Controller

控制器监控集群的状态，并致力于将当前状态转变为期望的状态

常见的 Controller ：Deployment, Job, Daemonset, StatefulSet

Deployment 最常用的 Controller  
Daemonset 最多只运行一个 pod 副本的场景  
Statefulset pod 的名称在整个生命周期不变，保证副本按照顺序启动，更新，删除  
Job 运行结束就删除  

Controller 通过 label 关联 pod
