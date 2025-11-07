---
title: 给Linux安装Clash实现代理上网并且实现软路由功能
description: Clash
pubDate: 11 07 2025
image:
categories:
  - NAS
  - Linux
tags:
  - Armbian Linux
  - Arm64/aarch64
  - Clash
  - Proxy
  - VPN
---

## 前言
传统的Clash使用方式比较繁琐且难用，我在Github中找到了一个项目，可以很方便的使用Clash，并且支持远程链接导入配置文件和管理Clash。接下来准备去安装。

## 安装Clash
访问以下链接，<a href="https://github.com/nelvko/clash-for-linux-install.git" target="_blank">clash-for-linux-install Github</a></br>
点开链接后按照Readme的提示去安装，不过截止到我写这篇文章的时候，作者好像更新了他的项目，据说已经可以自动识别系统架构，下载对应版本的内核和工具，这样大家可以不用切换分支去安装了。

```bash
git clone --branch master --depth 1 https://gh-proxy.com/https://github.com/nelvko/clash-for-linux-install.git \
  && cd clash-for-linux-install \
  && sudo bash install.sh
```

作者使用了加速前缀，可以加速clone到本地，如果不可用的话可以试试挂VPN或者使用其他的在线加速网站</br>
如果使用的不是bash，而是像我一样使用的是zsh，把命令中bash改成zsh即可

```bash
sudo zsh install.sh
```

安装完成后可以直接导入远程订阅即可使用，远程订阅可以到各自的机场运营商获取到</br>
如果要查看更详细的使用帮助请到项目主页的Readme查看。</br>

导入成功后开启clash
```bash
clashon
```
然后我们打开TUN模式，代理全部流量</br>
主要是系统代理这东西我玩不转，只能尝试代理全部流量（懒的动脑子了，能用就行）
```bash
clashtun on
```

如果执行到这一步没有什么问题的话，恭喜你已经成功使用Clash进行科学上网了！

## 开启Clash的代理服务器转发Clash流量
大部分情况下使用Clash的AllowLAN可以把Clash当作一个代理服务器共享流量给其他设备。但是有个极大的问题，我们刚才使用的是TUN模式使用的Clash，这种模式有个问题，就是会代理全部的Clash流量，如果使用的是NAS之类的需要本地流量上传到其他设备里会造成卡顿并且有可能消耗流量，因此我们来设置规则让本地流量不走Clash。

安装vim编辑器
```bash
sudo apt install vim
```
安装完成后打开Clash的mixin.yaml文件
```bash
clashmixin -e
```
打开后在第15行有个自定义规则，我们可以在那里添加规则：
```yaml
rules:
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve # 10.x.x.x 范围
  # - 'IP-CIDR,172.16.0.0/12,DIRECT'   # 172.16.x.x 到 172.31.x.x 范围
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve # 192.168.x.x 范围
  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve # 本地回环地址 (通常不需要，但添加更安全)
  - DOMAIN,api64.ipify.org,DIRECT # 用于 clashui 获取真实公网 IP
```

mixin.yaml填写完成后使用vim的:wq保存
```vim
:wq
```

在我这里Docker使用的是172网段，我的Docker还是需要使用科学上网的，在我这里就注释掉这段了，正常情况下大家可以删除那段注释。如果各位需要查看自己的Docker使用的是什么IP，可以使用ip命令查看。
```bash
Linux:~# ip a

5: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 4a:4e:e9:88:8c:73 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::484e:e9ff:fe88:8c73/64 scope link
       valid_lft forever preferred_lft forever
```
配置完成后可以重启以下系统或者只重启一下服务
```bash
reboot
```
或者
```bash
systemctl restart mihomo.service
```
上面两条命令任选其一

## 使用Web后台管理
使用Clash的Web后台管理页面来让Clash拥有UI
```bash
clashui
```
会输出一段网页地址，键盘按住CTRL然后点击内网的网页地址即可进入后台。
进入后台后可能会发现无法使用，用一会就会闪退到登录页面，解决方法就是在URL栏输入clashui获取到的IP和端口，输入完成后在旁边的Secret输入密钥，密钥在命令行输入clashsecret获取
```bash
clashsecret
```
完成后即可打开后台。<br>

打开后台后在配置一栏中打开Allow LAN，至此配置已完成。