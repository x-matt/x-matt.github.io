## Android系统分区 [^1]

### 传统分区 (Non-A/B)

| 分区         | 说明                                                                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bootloader | 设备启动后，会先进入bootloader程序，这里会通过判断开机时的按键组合（也会有一些其他判断条件，暂不赘述）选择启动到哪种模式，这里主要有Android系统、recovery模式、fastboot模式等。                                                          |
| boot       | 包含有Android系统的kernel和ramdisk。如果bootloader选择启动Android系统，则会引导启动此分区的kernel并加载ramdisk，完成内核启动。                                                                          |
| system     | 包含有Android系统的可执行程序、库、系统服务和app等。内核启动后，会运行第一个用户态进程init，其会依据init.rc文件中的规则启动Android系统组件，这些系统组件就在system分区中。将Android系统组件启动完成后，最后会启动系统app —— launcher桌面，至此完成Android系统启动。 |
| vendor     | 包含有厂商私有的可执行程序、库、系统服务和app等。可以将此分区看做是system分区的补充，厂商定制ROM的一些功能都可以放在此分区。                                                                                              |
| userdata   | 用户存储空间。一般新买来的手机此分区几乎是空的，用户安装的app以及用户数据都是存放在此分区中。用户通过系统文件管理器访问到的手机存储（sdcard）即此分区的一部分，是通过fuse或sdcardfs这类用户态文件系统实现的一块特殊存储空间。                                         |
| recovery   | 包含recovery系统的kernel和ramdisk。如果bootloader选择启动recovery模式，则会引导启动此分区的kernel并加载ramdisk，并启动其中的init继而启动recovery程序，至此可以操作recovery模式功能（主要包括OTA升级、双清等）。                     |
| cache      | 主要用于缓存系统升级OTA包等。双清就是指对userdata分区和cache分区的清理。                                                                                                                      |
| misc       | 主要用于Android系统和bootloader通信，使Android系统能够重启进入recovery系统并执行相应操作。                                                                                                     |

### A/B分区

- 分区分为A&B两个槽(slot)
- 用户使用A-slot时候, 对B-slot进行升级, 可以实现无感知升级

分区              | 说明
------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
bootloader        | 功能同non-A/B的bootloader，只是此处会根据A/B槽的bootable、successful、active等标识来选择启动哪个槽。根据不同厂商的实现，可以是唯一的不区分A/B的bootloader，也可以自定义，例如高通的实现bootloader是由唯一的pbl（此分区无法擦写）来选择A/B槽，启动xbl_a/xbl_b，再启动abl_a/abl_b。
boot_a/boot_b     | 包含kernel和recovery的ramdisk。recovery打包在boot分区中，则不再需要recovery分区。并且recovery系统也不再负责OTA升级（由Android系统中update_engine服务负责），仅负责双清等其他操作。
system_a/system_b | 功能同non-A/B的system分区，只是区分了A和B两个槽。
vendor_a/vendor_b | 功能同non-A/B的vendor分区，只是区分了A和B两个槽。
userdata          | 功能同non-A/B的userdata，并且用户数据仅存储一份，不区分A/B。
misc              | 功能同non-A/B的misc，不区分A/B。
persist           | 用来存储一些持久化数据，不会随着双清、OTA等操作被清除。不区分A/B。

### SSI

- 全称: Shared System Image
- 含义: SSI是指，在Android版本相同的情况下，各个Android设备的ROM镜像中，system.img都是由该版本的原生AOSP（或厂商定制）代码编译出的，是多产品共同使用的、与具体硬件设备无关的系统镜像
- 目的: 使设备代码的移植变得更加友好

![ssi](/assets/images/2023-11-07-11-21-10.png)

逻辑分区名  | 内容描述
------------|------------------------------------------------
system(SSI) | 通用Android系统组件，原则上不同厂商、不同型号的设备都通用
product     | 与特定产品有关的模块，包括对于Android系统的定制化
vendor      | 厂商对系统的定制，例如高通对Android系统附加的功能，包括一些闭源的程序等
odm         | 可选的分区，包含SOC附加的程序，这些内容可以集成在vendor中，也可以单独分离出odm分区

[^1]: [Android系统分区与升级](https://zhuanlan.zhihu.com/p/364003927?utm_id=0)
