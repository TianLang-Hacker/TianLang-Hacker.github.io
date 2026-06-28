---
title: 将OEC/OEC Turbo的系统迁移到外接硬盘里实现系统分区扩容
description: OEC Turbo的系统迁移到外接硬盘
pubDate: 28 06 2026
image:
categories:
  - Linux
  - NAS
  - Daily
tags:
  - Armbian Linux
  - Linux
  - NAS
  - OEC Turbo
  - OEC
---

## 前情提要

自从我2025年10月11号买了OEC Turbo刷Armbian后就一直拿来当小服务器使用，挂了一堆服务，用着用着发现6GB的系统空间还是不够用，安装CasaOS后在应用市场里下载软件容器后就没多少空间了，限制太大了，所以这次额外买了120G固态来把Armbian Linux 迁移到外接的硬盘里，这样不管下载多少容器都不用担心容量空间不足了。

<img src="/image/Flashing%20OEC%20Turbo/Goofish-by-OECT.png" width="500" height="438.5">

## 资源下载
资源我放到了 GitHub 仓库里了，有需要的可以去 GitHub 看看。
<br>
<a href="https://github.com/TianLang-Hacker/OEC-OEC-Turbo-Flash-tool-and-Armbian-Linux-mirror/releases" target="_blank">GitHub Releases</a>
<br>
当然你也可以通过在线代理GitHub得到更快的下载速度，下面有两条加速链接，哪个速度快就用哪个吧
<br>

Cloudflare混合加速

```bash
https://gh-proxy.org/https://github.com/TianLang-Hacker/OEC-OEC-Turbo-Flash-tool-and-Armbian-Linux-mirror/releases/download/1.0/OEC-OEC_Turbo_Flash_Driver_and_Armbian_Linux_img.zip
```

Fastly CDN 加速
```bash
https://cdn.gh-proxy.org/https://github.com/TianLang-Hacker/OEC-OEC-Turbo-Flash-tool-and-Armbian-Linux-mirror/releases/download/1.0/OEC-OEC_Turbo_Flash_Driver_and_Armbian_Linux_img.zip
```

## 重装系统（如果你觉得你的机器不需要重装的话建议直接跳过“重装系统”步骤，跳到“迁移系统”步骤）

### 安装驱动

首先准备一个OEC或者OEC Turbo，打开提前下载好的驱动包，找到DriverInstall.exe

![](/image/Flashing%20OEC%20Turbo/Driver%20Folder.png)

![](/image/Flashing%20OEC%20Turbo/Install-Driver.png)

点击“开始安装”，等待安装成功。

![](/image/Flashing%20OEC%20Turbo/Install-driver-success.png)

### 刷入Armbian Linux
注意：本次刷机只适合刷机后的 OEC 或 OEC Turbo，不适用第一次刷机，如果机器是第一次刷机则需要拆出主板短接两个触点后插入数据线连接电脑，直到瑞芯微开发工具提示“发现一个MASKROM设备”为止，我的机器之前我自己刷过了，这里就不赘述了（主要是拆开来拍照麻烦）。
<br>
<br>
首先掀开机器底部，盖子向上推即可打开底盖。

<img src="/image/Flashing%20OEC%20Turbo/OECT.jpg" width="400" hetght="600">
<img src="/image/Flashing%20OEC%20Turbo/OECT_USB-C.jpg" width="400" height="600">

打开RKDevTool.exe，进入瑞芯微的刷机界面。

![](/image/Flashing%20OEC%20Turbo/RKDev-tools.png)
![](/image/Flashing%20OEC%20Turbo/RKDev-tools-none.png)

按住RESET孔后数据线连接机器，进入LOADER状态

<img src="/image/Flashing%20OEC%20Turbo/OECT_RESET.jpg" width="400" height="600">
<img src="/image/Flashing%20OEC%20Turbo/RKDevTool_LOADER.png">

进入LOADER状态后勾选system，选择Armbian镜像，选择完成后点击执行，等待它刷入完成，这个过程需要几分钟，坐在旁边玩手机或者吃顿饭就行~

![](/image/Flashing%20OEC%20Turbo/Flashing-Armbian.png)
![](/image/Flashing%20OEC%20Turbo/Flash-done.png)

完成后关闭RKDevTool.exe，拔掉USB-C数据线，准备插电自动开机。

### 配置Armbian Linux
将网线接入RJ45接口，与电脑处在同一个局域网内，可以在路由器的后台发现该设备。

<img src="/image/Flashing%20OEC%20Turbo/LAN-Devices.png" width="824" height="824">

找到armbian，查看它的IP地址

<img src="/image/Flashing%20OEC%20Turbo/DevicesIP.png" width=815 height=471>

已知它的IP是192.168.0.106（以此为例），使用ssh连接Armbian。如果没有ssh，可以在Windows设置里的可选功能找到OpenSSH。

![](/image/Flashing%20OEC%20Turbo/SSH.png)

安装完成后使用SSH连接Armbian（IP地址仅当例子，要按自己实际的IP去填写）。

```shell
ssh root@192.168.0.106
```
密码是1234

登录进系统后发现需要你简单设置一下系统

![](/image/Flashing%20OEC%20Turbo/Set-Linux.png)

在这里需要设置root密码和选择一个默认shell，这里我选择zsh，因为比bash好用😋

之后可以设置一个普通账户，我平时喜欢root权限下去操作Linux，这里我选择Ctrl + C 跳过该设置。

上面的步骤配置完成后就可以进Armbian Linux了。

![](/image/Flashing%20OEC%20Turbo/Armbian-set-done.png)

## 迁移系统

### 硬盘分区
在迁移系统之前首先要对硬盘进行分区，插入电脑后打开DiskGenius，先检查分区表类型是不是GPT（GUID），如果是则直接下一步，如果是否建议先转换成GPT（GUID）格式分区表，操作方式如下：
<br>
打开DiskGenius，在顶栏找到磁盘 - 转换分区表类型为 GUID 格式，转换完成后可以进行下一步操作。
<br>

首先在DiskGenius分好两个分区，一个是系统分区，一个是数据分区（可以当NAS用），两个硬盘分区都是EXT4格式。

![](/image/Flashing%20OEC%20Turbo/DiskGenius.png)

首先点击“删除分区”，把所有的分区全部删掉，删掉后使用快速分区分出两个分区，第一个分区最好30GB起步，剩下的空间作为第二个分区，分好区后格式化成EXT4文件系统。
<br>
格式化完成后插入 OEC Turbo 使用lsblk查看硬盘各个分区信息：

```bash
lsblk
```


```bash
armbian:~:# lsblk
NAME         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda            8:0    0 119.2G  0 disk
├─sda1         8:1    0    30G  0 part
└─sda2         8:2    0  89.2G  0 part
mmcblk0      179:0    0   7.3G  0 disk
├─mmcblk0p1  179:1    0     4M  0 part
├─mmcblk0p2  179:2    0     4M  0 part
├─mmcblk0p3  179:3    0    64M  0 part
├─mmcblk0p4  179:4    0    64M  0 part
├─mmcblk0p5  179:5    0    32M  0 part
├─mmcblk0p6  179:6    0   512M  0 part /boot
└─mmcblk0p7  179:7    0   6.6G  0 part /var/log.hdd
                                       /
mmcblk0boot0 179:32   0     4M  1 disk
mmcblk0boot1 179:64   0     4M  1 disk
zram0        252:0    0   1.9G  0 disk [SWAP]
zram1        252:1    0    50M  0 disk /var/log
zram2        252:2    0     0B  0 disk
```

在这里我们可以发现sda硬盘有119.2G，sda1分了30GB，sda2分了89.2GB，如果说作为存储盘的话建议硬盘买大点（最近硬盘实在是太贵了，没办法只能买个120GB的凑合用了😭），然后sda1分区建议多分点，多分点容量也就能多挂载一些服务。

### 创建硬盘挂载点目录并挂载
先在 /mnt 文件夹里新建一个sda1文件夹，然后将硬盘上的sda1分区挂载到这个目录里。

```bash
mkdir  /mnt/sda1
```

```bash
mount  /dev/sda1  /mnt/sda1
```

### 复制根目录到/mnt/sda1
```bash
rsync -aAXv / /mnt/sda1 --exclude={"/dev/*","/proc/*","/sys/*","/tmp/*","/run/*","/mnt/*","/media/*","/lost+found"}
```
![](/image/Flashing%20OEC%20Turbo/rsync.png)

### 查看sda1新分区的 UUID

```bash
blkid /dev/sda1
```

在这里可以看到 各个分区的 UUID 是什么

```bash
armbian:~:# blkid /dev/sda1
/dev/sda1: UUID="e045136e-a37d-ac4d-b85d-c055f990669e" BLOCK_SIZE="1024" TYPE="ext4" PARTLABEL="Basic data partition" PARTUUID="ee790825-341b-42ff-896d-d1918347363f"
armbian:~:#
```

```bash
armbian:~:# blkid
/dev/mmcblk0p7: LABEL="ROOTFS_EMMC" UUID="7ba6f126-a3e1-4fc2-b934-40f23013bf65" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="8b4e9cfa-ac66-4e91-8209-da8de6772422"
/dev/mmcblk0p6: LABEL="BOOT_EMMC" UUID="e05f8383-636b-4308-aa37-7867505dd45d" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="e2389fdb-8450-4192-83b5-f3ee89b17046"
/dev/sda2: UUID="5a88855b-d414-ed49-80c0-516f0b68d162" BLOCK_SIZE="1024" TYPE="ext4" PARTLABEL="Basic data partition" PARTUUID="68b3dc49-c243-4f8e-a381-32798fab22e3"
/dev/sda1: UUID="e045136e-a37d-ac4d-b85d-c055f990669e" BLOCK_SIZE="1024" TYPE="ext4" PARTLABEL="Basic data partition" PARTUUID="ee790825-341b-42ff-896d-d1918347363f"
/dev/mmcblk0p5: PARTLABEL="env" PARTUUID="fa2c0000-0000-4405-8000-6d3d00006f9a"
/dev/mmcblk0p3: PARTLABEL="boot" PARTUUID="7c500000-0000-4c1e-8000-6d0000000dd8"
/dev/mmcblk0p1: PARTLABEL="uboot" PARTUUID="67110000-0000-416d-8000-5693000068fa"
/dev/mmcblk0p4: PARTLABEL="kernel" PARTUUID="9a250000-0000-4d03-8000-231000002148"
/dev/mmcblk0p2: PARTLABEL="misc" PARTUUID="b8260000-0000-4b79-8000-542300005ce1"
/dev/zram1: LABEL="log2ram" UUID="e388d199-5b0d-491f-8ed3-549459922b90" BLOCK_SIZE="4096" TYPE="ext4"
/dev/zram0: UUID="e6112034-f91e-4c5c-a0d8-79ff41066749" TYPE="swap"
```

### 修改/etc/fstab

```bash
nano /etc/fstab
```
/etc/fstab文件内容如下：

```bash
UUID=  /      ext4  defaults,noatime,nodiratime,commit=600,errors=remount-ro  0 1
LABEL=BOOT_EMMC  /boot  ext4  defaults  0 2
tmpfs           /tmp     tmpfs    defaults,nosuid                                             0 0
```

UUID= 后面的内容替换成 /dev/sda1的 UUID，之后CTRL + X 保存文件。

### 修改/boot/armbianEnv.txt

```bash
nano /boot/armbianEnv.txt
```

修改第4行的 rootdev=UUID= ，后面跟着/dev/sda1的 UUID。
```bash
rootdev=UUID=
```

/boot/armbianEnv.txt 内容如下：

```bash
verbosity=1
bootlogo=false
fdtfile=rockchip/rk3566-onething-oec-box.dtb
rootdev=UUID=
rootfstype=ext4
rootflags=rw,errors=remount-ro
overlay_prefix=rk3566
overlays=
extraargs=
extraboardargs=net.ifnames=0 max_loop=128
docker_optimizations=on
usbstoragequirks=0x2537:0x1066:u,0x2537:0x1068:u
```

### 修改 /boot/extlinux/extlinux.conf

```bash
nano /boot/extlinux/extlinux.conf
```
修改第五行的 root=UUID= ,替换成/dev/sda1的 UUID。

```bash
root=UUID=
```

/boot/extlinux/extlinux.conf 完整内容如下：

```bash
LABEL Armbian
  LINUX /Image
  INITRD /uInitrd
  FDT /dtb/rockchip/rk3566-onething-oec-box.dtb
  APPEND root=UUID= rootflags=data=writeback rw rootwait rootfstype=ext4 console=ttyS2,1500000 console=tty1 no_console_suspend consoleblank=0 fsck.fix=yes fsck.repair=yes net.ifnames=0 max_loop=128 bootsplash.bootfile=bootsplash.armbian
```

### 重启系统

完成修改 UUID 后重启系统

```bash
reboot
```

重启完成后可以查看当前系统根目录的容量。

```bash
    _             _    _              ___  ___
   /_\  _ _ _ __ | |__(_)__ _ _ _    / _ \/ __|
  / _ \| '_| '  \| '_ \ / _` | ' \  | (_) \__ \
 /_/ \_\_| |_|_|_|_.__/_\__,_|_||_|  \___/|___/

 v25.05.0 for RK.Efused-Wxy-Oec running Armbian Linux 6.1.99-rk35xx-ophub

 Packages:     Debian stable (bookworm)
 IP addresses: (LAN) IPv4: 192.168.0.100  (WAN) ***.***.***.***

 Performance:

 Load:         45%              Up time:       0 min
 Memory usage: 4% of 3.81G
 CPU temp:     48°C              Usage of /:   7% of 30G

 Commands:

 Configuration : armbian-config
 Monitoring    : htop

Last login: Mon Jun 29 02:37:13 2026 from 192.168.0.113
armbian:~:#
```

现在我们可以看到第15行上面写着 Usage of /:   7% of 30G ，说明系统迁移成功。

至此，你拥有了一个大容量的OEC Turbo了，开搞开搞😋