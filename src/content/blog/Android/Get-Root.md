---
title: Android设备获取Root权限
description: 保姆级别的获取Root权限
pubDate: 07 01 2025
image: /image/Root/Root.jpg
categories:
  - Android
tags:
  - Android
  - Bootloader unlock
  - Fastboot
---

## 准备工作
在root手机之前先查看自己的Android核心版本，在设置-关于手机-Android版本-核心版本
以我的手机为例：我的手机核心版本为5.10.236-gki-g060fed194023
我们今天介绍的Root管理器要求核心版本在3.18 - 6.1版本内，如果不在以上范围内请自行搜索 <a href="https://michongs.github.io/MagiskChineseDocument/install.html" target="_blank" >Magisk</a> 教程。

### 下载ADB

在 <a href="https://developer.android.google.cn/tools/releases/platform-tools?hl=zh-cn#downloads" target="_blank">Andoird Developer</a> 里下载Platform-Tools。
<a href="https://developer.android.google.cn/tools/releases/platform-tools?hl=zh-cn#downloads" target="_blank">![](/image/Root/ADB-Download.png "ADB下载")</a>

下载完成后解压，你会得到如下文件：![](/image/Root/ADB-files.png)

#### 可选功能，给ADB工具写进环境变量

我们可以在adb文件夹中新建一个.txt文件，名字随意。将以下代码复制进.txt文件。<mark>注意！代码第五行要写入自己的ADB目录（绝对路径），否则脚本无效！</mark>
```batch
@echo off
setlocal

REM 你想要添加到Path的目录
set "new_path= "

REM 检查用户环境变量Path是否已经包含该目录
echo %PATH% | findstr /i /c:"%new_path%" >nul
if %errorlevel% equ 0 (
    echo 用户环境变量Path中已包含该路径。
) else (
    REM 添加目录到用户环境变量Path
    setx PATH "%PATH%;%new_path%"
    if %errorlevel% equ 0 (
        echo 路径已成功添加到用户环境变量。
    ) else (
        echo 无法添加路径到用户环境变量。
    )
)

REM 获取系统环境变量Path
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "sys_path=%%b"

REM 检查系统环境变量Path是否已经包含该目录
echo %sys_path% | findstr /i /c:"%new_path%" >nul
if %errorlevel% equ 0 (
    echo 系统环境变量Path中已包含该路径。
) else (
    REM 添加目录到系统环境变量Path
    set "new_sys_path=%sys_path%;%new_path%"
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path /t REG_EXPAND_SZ /d "%new_sys_path%" /f
    if %errorlevel% equ 0 (
        echo 路径已成功添加到系统环境变量。
    ) else (
        echo 无法添加路径到系统环境变量。
    )
)

endlocal
```

写完脚本后保存，使用管理员启动该脚本。在一个命令行弹窗闪退后环境变量添加成功。此时我们可以在Windows Terminal尝试启动adb。

### 测试ADB
手机进入设置-关于手机-Android版本，点击5此版本号解锁开发人员选项。进入设置-系统-开发人员选项，打开USB调试。
打开成功后数据线连接手机，在命令行中使用adb devices查看设备

```Command
adb devices
```

如果出现有设备显示说明ADB连接成功，如果没有则需要在Windows更新里更新下面两个ADB驱动。
![](/image/Root/ADB-Driver.png "ADB驱动")

更新完ADB驱动后再次尝试adb devices，则成功检测到设备。

### 获取boot.img/init_boot.img

现在的刷机包上有两种boot镜像文件，分别是boot.img和init_boot.img使用手机在手机官网上下载对应机型的刷机包，如果是类原生Android，则需要自己在各种论坛或官网上寻找刷机包。

#### 线刷包

下载下来后可直接获取boot.img/init_boot.img。

#### 卡刷包

下载下来后会获得一个体积很大的payload.bin文件，请自行选择电脑操作或手机操作。

##### 电脑操作

电脑上下载 <a href="https://mrzzoxo.lanzoue.com/b02plgdpi" target="_blank" >Payload Dumper</a> 下载下来后解压，解压完成后把Payload.bin文件复制到文件夹内，点击“打开CMD命令行.bat”
![](/image/Root/Payloaddumper.png "Payload Dumper")
如果第二个不行就选择第三个。提取成功后把boot.img/init_boot.img文件复制到手机里。

##### 手机操作
手机上下载 <a href="https://mt2.cn/" target="blank">MT管理器</a> ，下载完成后在MT管理器找到卡刷包文件，进入刷机包文件，直接解压payload.bin里面的boot.img/init_boot.img。
![](/image/Root/MT.png "MT管理器")

## 开始Root
### 选择Root管理器
一个好的Root管理器对于之后的玩机是有很大的帮助。目前流行的Root管理器是 <a href="https://magisk.me/" target="_blank" >Magisk</a> 系列（<a href="https://github.com/CoderTyn/Magisk-Alpha" target="_blank" >Magisk Alpha</a>、<a href="https://magisk.me/" target="_blank" >Magisk</a>、<a href="https://github.com/shockeyzhang/magisk-delta" target="_blank" >Magisk Delta</a>）<a href="https://kernelsu.org/zh_CN/" target="_blank" >KernelSU</a>、<a href="https://apatch.dev/zh_CN/" target="_blank" >APatch</a>等。

对于大部分人来说Magisk就已经足够使用了，因为Magisk兼容性很强，几乎兼容任何版本的Android（远古版本除外），但在我这里我不推荐Magisk，因为它的隐藏Root能力相对于其他的来说比较弱，数字人民币，交管12123，部分银行软件等会检测Root权限的存在，检测到Root权限软件就会闪退，无法使用。而有个很好用的内核级别的隐藏Root权限的Root管理器就是 <a href="https://apatch.dev/zh_CN/" target="_blank" >APatch</a>，而这次就选择 <a href="https://apatch.dev/zh_CN/" target="_blank" >APatch</a> 来获取Root权限。

在 <a href="https://github.com/bmax121/APatch/releases" target="_blank" >Github</a> 上下载最新版本的APatch，安装完成后选择安装，在安装选项里选择“修补选定内核镜像（用于首次Root）”，选择好boot.img/init_boot.img后设置一个超级密钥，这个超级密钥随便填写，但要记住该密钥（虽然记住不记住也没啥事）。填写好后开始修补，修补好的boot.img文件会保存在/storage/emulated/0/Download文件夹里（Download文件夹），里面会有一个“apatch_patched_xxxxx_x.xx.x_xxxx.img”。把这个文件复制到电脑上，准备刷入boot镜像。

### 刷入root

手机连接电脑，使用ADB让手机重启到Fastboot模式
```Command
adb reboot fastboot
```
重启成功后手机会自动进入Fastboot模式，小米手机会显示一个大大的橙色字体的FASTBOOT。进入Fastboot模式后在命令行将修补好的boot.img/init_boot.img刷入进手机里

对于boot.img
```Command
fastboot flash boot boot.img
```

对于init_boot.img
```Command
fastboot flash init_boot init_boot.img
```
<mark>注意！后面的xxx.img是要写镜像文件的绝对路径，不能写错了。</mark>

如果不出意外，你会看到Finish字样，说明刷入成功。

此时重启手机，你会获得root权限。
```Command
fastboot reboot
```
如果发现重启手机后无法进入系统，则需要把原来的boot.img/init_boot.img刷回手机。
无法进入系统的原因有很多，有模块不兼容的影响，有修补的时候内核不兼容等，根据情况请自行判断。