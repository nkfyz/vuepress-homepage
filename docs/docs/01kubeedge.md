# Kubeedge推荐搭建流程

本文主要参考[@三月沙](https://sanyuesha.com/2019/05/17/kubernetes-tutorial-for-beginner/)

## 本文环境

- CPU 2核以上
- 可以连接互联网
- Ubuntu 18.04 on VMware/ Aliyun ECS

## 主要配置步骤

+ __基础配置__
	- 配置apt国内源
	- 获取Vim编辑器
+ __Kubernetes集群部署__
	- Docker-ce安装
		* 添加Docker密钥
		* 获取Docker
		* 配置Docker国内源
	- Kubernetes配置
		* 添加Kubernetes源
		* 获取Kubernetes
		* 启动Kubernetes Master
	- 多机器部署
		* 启动Kubernetes Slaver
+ __Kubeedge集群部署__
	- Golang安装
		* 获取Golang
		* 配置环境变量
	- 获取Kubeedge
		* 初始化
+ __Enjoy Kubeedge__ 8-)

## 配置apt国内源

``` sh
#备份原有源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

#更换
sudo vim /etc/apt/sources.list

#内容修改为
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src https://mirrors.ustc.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse

#更新apt源
sudo apt-get update
```

## 获取Vim编辑器

``` sh
sudo apt-get vim
```

## 添加Docker密钥

``` sh
#添加Docker源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
sudo apt update

#安装需要的包
sudo apt install apt-transport-https ca-certificates software-properties-common curl

#添加GPG密钥，并添加 Docker-ce 软件源，以中国科技大学的 Docker-ce源为例
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
$(lsb_release -cs) stable"

#添加成功后更新软件包缓存
sudo apt update
```

## 获取Docker

```sh
sudo apt install docker-ce
```

## 配置Docker国内源

``` sh
#修改文件内容
sudo vim /etc/docker/deamon.json
{
	"registry-mirrors" : [
        "http://ovfftd6p.mirror.aliyuncs.com",
        "http://registry.docker-cn.com",
        "http://docker.mirrors.ustc.edu.cn",
        "http://hub-mirror.c.163.com"
    ],
    "insecure-registries" : [
        "registry.docker-cn.com",
        "docker.mirrors.ustc.edu.cn"
    ],
    "debug" : true,
    "experimental" : true
}

#重启docker
sudo systemctl restart docker
sudo docker info
```

***

## 添加Kubernetes源

``` sh
apt-get update
apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 

cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF

apt-get update
```

## 获取Kubernetes

``` sh
apt-get install -y kubelet kubeadm kubectl

systemctl daemon-reload
systemctl restart kubelet
```

三个组件的作用
+ kubelet 是 work node 节点负责 Pod 生命周期状态管理以及和 master 节点交互的组件
+ kubectl k8s 的命令行工具，负责和 master 节点交互
+ kubeadm 搭建 k8s 的官方工具

## 启动Kubernetes Master

``` sh
#初始化kuberadm环境
kubeadm init --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers --pod-network-cidr=192.168.0.0/16

#非root用户及系统环境设置
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

#网络插件Calico环境
kubectl apply -f https://docs.projectcalico.org/v3.9/manifests/calico.yaml

#如果Calico部署失败，重新部署命令
kubectl replace --force -f https://docs.projectcalico.org/v3.9/manifests/calico.yaml

#获取kubernetes pods状态, 全部runninng即为成功
kubectl get pods --all-namespaces
```

## 启动Kubernetes Slaver

``` sh
kubeadm join 10.10.76.89:6443 --token t51nk2.4rtw6twkmca53nbu \
    --discovery-token-ca-cert-hash sha256:8356397a4ccd20b2d6506130e8bb4ad13ccc3fe33302296d3c48651601be5bfd
```

``` sh
#在Master端查看
kubectl get nodes
```

## 获取Golang

``` sh
tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
```

## 配置环境变量

``` sh
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
source ~/.bashrc
```

## 获取Kuberedge

推荐采用[官方教程](http://docs.kubeedge.io/en/latest/setup/kubeedge_install_keadm.html#getting-kubeedge-installer)部署Kubeedge.

由于Github国内访问速度较慢，[点击此处下载Ubuntu 64bit 适用的kubeedge.tar.gz v1.1.0](../../file/kubeedge-v1.2.1-linux-amd64.tar.gz).

``` sh
git clone https://github.com/kubeedge/kubeedge.git $GOPATH/src/github.com/kubeedge/kubeedge

#编译 （记得设置GOPATH环境变量代表工作空间，否则会报错）
cd $GOPATH/src/github.com/kubeedge/kubeedge
make all WHAT=keadm

#Cloud端启动运行
#
#将.tar.gz文件拷贝至/etc/kubeedge/
#此处务必是绝对路径
cd /home/f/go/src/github.com/kubeedge/kubeedge/_output/local/bin
./keadm init --kube-config=/root/.kube/config/admin-config
```
