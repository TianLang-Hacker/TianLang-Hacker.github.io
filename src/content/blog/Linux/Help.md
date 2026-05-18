---
title: Linux使用过程中的部分问题解决方案（有些已经不可用）
description: 解决方案
pubDate: 18 05 2026
image:
categories:
  - Linux
tags:
  - Linux
  - WSL
  - VPN
---

## Windows Subsystem for Linux TAB无法补全代码

没有安装bash-completion，解决方法

```bash
apt install bash-completion
```

之后重启Linux子系统

---

## Linux声卡伪输出

添加配置文件和给驱动加入黑名单

```bash
echo options snd-hda-intel dmic_detect=0 | sudo tee -a /etc/modprobe.d/alsa-base.conf
```

```bash
echo blacklist snd_soc_skl | sudo tee -a /etc/modprobe.d/blacklist.conf
reboot
```

添加新方法：执行以上命令后发现没有可以添加以下命令：

```bash
usermod --append --groups audio root
```

```bash
pulseaudio --kill
```

如果发现E: \[pulseaudio\] main.c: 杀死守护进程失败：没有那个进程，说明没有运行这个程序，解决方案：命令行输入 pulseaudio 即可

最后删除/etc/modprobe.d/blacklist.conf

参考以下资料：https://blog.csdn.net/qq_43497702/article/details/104370104

---

## 安装简单录屏

```bash
apt install simplescreenrecorder
```

---

## Intel OpenCL (GPU compute) 驱动（现在已经失效）

```bash
apt install beignet
```

---

## ~~Linux安装Wine QQ~~

注意！QQ在2022年12月30日发布新版LinuxQQ，对Linux的支持变的非常好，无需安装Wine QQ

安装Wine和Wine的环境库和支持库

```bash
dpkg --add-architecture i386 && apt update && apt dist-upgrade && apt install wine32 winetricks winbind wine32-preloader && winetricks riched20
```

在.bashrc或者.zshrc文件添加环境变量

```shell
export WINEPREFIX=~/win32
export WINEARCH=win32
```

加载环境变量

```bash
source ~/.zshrc
```

去官网下载QQ或微信安装包然后使用Wine运行安装包

```bash
wine 文件名.exe
```

文件夹打开/root/win32/drive_c/Program Files/Tencent/QQ/bin  //不要用命令行cd挂载文件夹，否则可能会挂载失败。

右击点击“在终端打开”，即可打开命令行 输入wine QQ.exe，即可打开QQ

---

## VLC播放器在root环境下运行

1、显示vlc的目录

```bash
which vlc
```

2、安装Hexeditor

```bash
apt install ncurses-hexedit
```

3、在hexeditor里打开vlc软件

```bash
hexeditor /usr/bin/vlc
```

4、键盘键入Ctrl+W打开搜索

5、输入A切换文本搜索

6、搜索geteuid，Enter搜索

7、搜索到geteuid后把geteuid改成getppid，修改方法：geteuid对应以下Hex值：67 65 74 65 75 69 64，只需要改成67 65 74 70 70 69 64即可。

8、键盘键入Ctrl+X后保存并退出

---

## Steam Linux版在root环境打开

1、打开Steam启动文件

```bash
nano /usr/bin/steam
```

2、找到 #Don't allow running as root代码

```bash
# Don't allow running as root
if [ "$(id -u)" == "0" ]; then
    show_message --error $"Cannot run as root user"
    exit 1
fi
```

4、注释或删除这段代码最后Ctrl+X保存即可

---

## 安装其他软件包的时候删除软件自带的官方仓库

1、删除/etc/apt/sources.list.d文件夹下目标软件仓库 例子：删除Spotify Linux版的仓库：在/etc/apt/sources.list.d/里找到所有关于Spotify的软件仓库，然后删除这些文件，最后进入命令行运行apt update即可解决

---

## 在WSA里使用VPN

现在Microsoft官方已经停止支持WSA，该教程已经荒废

1、下载ADB文件，可以在Android开发者网站上下载，[https://developer.android.google.cn/studio/command-line/adb?hl=zh-cn]()

2、命令行打开adb，然后让adb与WSA连接

```bash
adb connect 127.0.0.1:58526
```

3、进入Android系统的控制台

```bash
adb shell
```

4、

```bash
appops set app_package_name ACTIVATE_VPN allow
```

同意VPN软件添加系统VPN设置，app_package_name为Android软件包名字，可以在软件包快捷菜单的属性找到，以蓝灯VPN举例，操作步骤如下：开始菜单>蓝灯VPN>右击>更多>打开文件位置>蓝灯快捷方式>右击属性>你可以在目标找到wsa://org.getlantern.lantern，在wsa://后面的名称就是软件包名称，也就是org.getlantern.lantern，完整命令也就是appops set org.getlantern.lantern ACTIVATE_VPN allow，其他软件照葫芦画瓢，操作是一样的。

---

## 新版Steam Linux报错：WARNING: setlocale('en_US.UTF-8') failed, using locale: 'C'. International characters may not work.

此方法适用于所有打开软件时同样的报错 根据报错得知：设置区域设置（'en_US.UTF-8'） 失败，使用区域设置：“C”。国际字符可能不起作用。 Steam默认的语言地区是en_US，不管进设置修改语言都是这样的情况。

1、查看系统当前语言

```bash
echo $LANG
```

2、查看locale库是否存在

```bash
ll /usr/lib/locale/locale-archive
```

3、删除locale库

```bash
rm -f /usr/lib/locale/locale-archive
```

4、重新生成中文的locate文件（配置哪个语言就生成哪个语言文件）

```bash
localedef -c -f UTF-8 -i zh_CN zh_CN.utf8
```

5、修改locale.conf中的LC_ALL

```bash
nano /etc/locale.conf
```

6、在locale.conf添加以下内容

```bash
LC_ALL=zh_CN.UTF-8
```

添加完毕后Ctrl+X命令保存并退出

7、使用localectl永久修改locale的LANG （相当于在/etc/locale.conf中添加LANG=zh_CN.UTF8）

```bash
localectl set-locale LANG=zh_CN.UTF8
```

8、配置生效

```bash
source /etc/locale.conf
```

---

## apt upgrade遇到错误：/usr/bin/dpkg returned an error code (1)

1、挂载到/var/lib/dpkg

```bash
cd /var/lib/dpkg
```

2、备份info和info.bak文件

```bash
mv info info.bak
```

3、新建info文件夹

```bash
mkdir info
```

4、更新软件包

```bash
apt upgrade
```

---

## 安装VMware Workstation 提示报错：Before you can run VMware, several modules must be compliled and load into the running kernel

1、安装git和build-essential

```bash
apt install git build-essential
```

2、把模块克隆到本地

```bash
git clone https://github.com/mkubecek/vmware-host-modules.git
```

3、挂载到目录

```bash
cd /vmware-host-modules
```

4、查看版本号

```bash
vmware -v
```

5、切换分支（安装的是什么版本就切换到什么版本）

```bash
git checkout workstation-xx.x.x
```

6、编译

```bash
make
```

7、安装

```bash
make install
```

8、打开VMware Workstation

---

## Linux安装NVIDIA显卡驱动,同时解决外接显示器的问题 （目前无法做到集成显卡与独立显卡的切换）

目前有两种方法安装NVIDIA显卡驱动，一种是镜像站下载deb包驱动，一种是NVIDIA官网上安装二进制驱动包

### NVIDIA官网下载NVIDIA驱动（二进制命令行可执行文件 .run），**推荐，对Wayland支持不错**

1、将nouveau驱动加入黑名单

```bash
echo -e "blacklist nouveau\noptions nouveau modeset=0" > /etc/modprobe.d/nvidia-installer-disable-nouveau.conf
```

2、给可执行文件授权可执行权限

```bash
chmod +x *.run
```

3、安装NVIDIA驱动

```bash
./*.run
```

- `–no-opengl-files`：表示只安装驱动文件，不安装OpenGL文件。这个参数不可省略，否则会导致登陆界面死循环，英语一般称为”login loop”或者”stuck in login”。

- `–no-x-check`：表示安装驱动时不检查X服务，非必需。

- `–no-nouveau-check`：表示安装驱动时不检查nouveau，非必需。

- `-Z, --disable-nouveau`：禁用nouveau。此参数非必需，因为之前已经手动禁用了nouveau。

- `-A`：查看更多高级选项。

### 2：~~镜像站下载NVIDIA驱动，==驱动版本过于落后，不推荐！==~~

1、将nouveau驱动加入黑名单

```bash
echo -e "blacklist nouveau\noptions nouveau modeset=0" > /etc/modprobe.d/nvidia-installer-disable-nouveau.conf
```

2、安装Linux头文件（安装二进制包或安装deb包的必要步骤）

```bash
apt install linux-headers-$(uname -r)
```

3、安装NVIDIA驱动和CUDA架构，如果显示是否生成xorg.conf文件，要选no

```
apt install nvidia-kernel-dkms nvidia-cuda-toolkit nvidia-driver
```

4、安装双显卡切换包，~~如果你是单显卡请无视该步骤~~

```bash
apt install bumblebee-nvidia primus
```

5、添加当前用户到bumblebee用户组，~~如果你是单显卡请无视该步骤~~

```
adduser $USER bumblebee
```

修改/etc/bumblebee/bumblebee.conf的第22行 ~~如果你是单显卡请无视该步骤~~ Driver=

```plaintext
Driver=nvidia
```

6、修改/etc/bumblebee/xorg.conf.nvidia ~~如果你是单显卡请无视该步骤~~

在Section "Device"中添加PCI ID

```plaintext
BusID "PCI:01:00:0"
```

BusID可以在命令行输入lspci | grep VGA得到

```bash
lspci | grep VGA
```

7、在/etc/X11/xorg.conf里添加配置文件xorg.conf

```plaintext
Section "ServerLayout"
    Identifier "layout"
    Screen 0 "nvidia"
    Inactive "intel"
EndSection

Section "Device"
    Identifier "nvidia"
    Driver "nvidia"
    # You may need to change the PCI value
    BusID "PCI:1:0:0"
EndSection

Section "Screen"
    Identifier "nvidia"
    Device "nvidia"
    Option "AllowEmptyInitialConfiguration"
EndSection

Section "Device"
    Identifier "intel"
    Driver "modesetting"
EndSection

Section "Screen"
    Identifier "intel"
    Device "intel"
EndSection
```

8、在/usr/share/gdm/greeter/autostart 和 /etc/xdg/autostart里创建配置文件optimus.desktop

```plaintext
[Desktop Entry]
Type=Application
Name=Optimus
Exec=sh -c "xrandr --setprovideroutputsource modesetting NVIDIA-0; xrandr --auto"
NoDisplay=true
X-GNOME-Autostart-Phase=DisplayServer
```

注意

- 删除xorg.conf和optimus.desktop可切换到Intel核显

- 添加xorg.conf和optimus.desktop即可切换到NVIDIA显卡

### 卸载NVIDIA驱动（适用于镜像站下载二进制deb包）

```bash
apt purge nvidia* bumblebee* prime*
```

### 卸载NVIDIA驱动（适用于NVIDIA官网下载二进制run可执行文件）

```bash
./NVIDIA*.run --uninstall
```