---
title: 集群安装
sidebar_position: 2
---

# Kubernetes 集群安装


使用 kubeadm 安装 K8S 集群

硬件要求：  
* 每台机器 2 CPUs
* 每台机器至少 2 GB 内存，建议 4 GB 以上
* 至少 20 GB 磁盘空间

测试环境：  
3 台 Oracle Cloud Arm server , 1C 6G, Ubuntu 24

给 3 台服务器设置好计算机名

```
sudo hostnamectl set-hostname master
sudo hostnamectl set-hostname worker1
sudo hostnamectl set-hostname worker2
```

设置 hosts

```
#/etc/hosts
10.0.31.43 master
10.0.230.102 worker1
10.0.8.117 worker2
```

设置 OverlayFS 文件系统驱动，和侨界网络数据包过滤

```
sudo apt install kmod

sudo modprobe overlay
sudo modprobe br_netfilter

# Add these lines to a new sysctl config file
sudo tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

# Apply sysctl parameters without reboot
sudo sysctl --system
```

安装容器运行时，这里使用 containerd ，如果安装 docker 也是可以的

```
# Install dependencies
sudo apt install -y curl gnupg2 software-properties-common apt-transport-https ca-certificates

# Install containerd
sudo apt install -y containerd

# Create default config
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

# Set SystemdCgroup = true
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

# Restart containerd
sudo systemctl restart containerd
sudo systemctl enable containerd

```

安装 kubeadm kubelet kubectl 

参考官方文档：https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/

```
sudo apt-get update
# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

# If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
# sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.33/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.33/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

sudo systemctl enable --now kubelet
```

初始化控制平台（ master 节点 ）

加上 `--ignore-preflight-errors=NumCPU` 参数跳过 cpu 核数校验，因为 cpu 不够

```
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --ignore-preflight-errors=NumCPU
```

成功后会输出如下：

```
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.0.31.43:6443 --token i5bqan.wqi8eibmn3o2lzm1 \
        --discovery-token-ca-cert-hash sha256:fa7ca7f8f791aff55e9f05049009c37628d09384150f3a3eb4dfa6a998481c59 --ignore-preflight-errors=NumCPU
```

也可以手动生成 join 的命令

```
$ sudo kubeadm token create --print-join-command
```

按照上面的输出为当前用户配置 kubectl ，允许管理集群

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

```
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
```


查看集群状态

```
$ kubectl get nodes
NAME     STATUS     ROLES           AGE   VERSION
master   NotReady   control-plane   17m   v1.33.1
```

查看 kube-system 名称空间的 pod

```
$ kubectl get pods -n kube-system
NAME                             READY   STATUS    RESTARTS   AGE
coredns-674b8bbfcf-4zjnn         1/1     Running   0          84m
coredns-674b8bbfcf-q77d2         1/1     Running   0          84m
etcd-master                      1/1     Running   1          85m
kube-apiserver-master            1/1     Running   1          85m
kube-controller-manager-master   1/1     Running   1          85m
kube-proxy-4zf5s                 1/1     Running   0          27m
kube-proxy-9bfpz                 1/1     Running   0          84m
kube-proxy-h4fwg                 1/1     Running   0          36m
kube-scheduler-master            1/1     Running   1          85m
```

两台 worker 加入集群

（需要开防火墙）

```
$ sudo kubeadm join 10.0.31.43:6443 --token i5bqan.wqi8eibmn3o2lzm1         --discovery-token-ca-cert-hash sha256:fa7ca7f8f791aff55e9f05049009c37628d09384150f3a3eb4dfa6a998481c59 
[preflight] Running pre-flight checks
[preflight] Reading configuration from the "kubeadm-config" ConfigMap in namespace "kube-system"...
[preflight] Use 'kubeadm init phase upload-config --config your-config-file' to re-upload it.
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-check] Waiting for a healthy kubelet at http://127.0.0.1:10248/healthz. This can take up to 4m0s
[kubelet-check] The kubelet is healthy after 1.004267028s
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

在 master 上查看集群状态

```
$ kubectl get nodes
NAME      STATUS     ROLES           AGE     VERSION
master    Ready      control-plane   57m     v1.33.1
worker1   Ready      <none>          8m47s   v1.33.1
worker2   NotReady   <none>          7s      v1.33.1
```

部署一个 nginx 测试

```
$ kubectl create deployment nginx --image=nginx
deployment.apps/nginx created
$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-5869d7778c-pv9kd   1/1     Running   0          8s
$ kubectl expose deployment nginx --port=80 --type=NodePort
service/nginx exposed
$ kubectl get svc
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP        132m
nginx        NodePort    10.103.86.214   <none>        80:31401/TCP   6s
```

访问 http://worker2:31401 即可打开默认页面

clean up

```
kubectl delete svc nginx
kubectl delete deployment nginx
```

启动和停止集群可以用 systemctl 启动和停止 kubelet 和 containerd ，先停止 worker node 再停止 master node ，先启动 master node 再启动 worker node

```
sudo systemctl stop kubelet
sudo systemctl stop containerd
```