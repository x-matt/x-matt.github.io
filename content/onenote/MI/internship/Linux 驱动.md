## 概述

- **冯诺依曼体系**：存储程序计算机
- **计算机三个法宝**：
    1. 存储程序计算机
    2. 函数调用堆栈
    3. 中断
- **操作系统两个法宝**：
    1. 中断上下文切换
    2. 进程上下文切换

## Unix 文件

- 普通文件  
- 目录文件  
- 链接文件  
- 特殊文件 - 输入输出设备

## 内核划分

1. 进程管理
2. 内存管理
3. [文件系统](https://www.zhihu.com/question/284540952/answer/440709116)
    - **定义**：在非结构化的硬件之上建立了结构化的文件系统
    - **目的**：在磁盘上定位和索引文件
    - **机制**：
        1. 可移动文件系统
        2. 10bit 权限保护系统
        3. 统一的输入输出调用
4. 设备控制
5. 网络

## 基本设备类型

- 字符模块 - 小数据量模块（键盘、鼠标、串口）  
- 块模块 - 大数据量模块（磁盘、软盘）  
- 网络模块 - 基于网络通信协议的设备（网卡、WiFi、蓝牙）

## [设备树](https://blog.csdn.net/Ian22l/article/details/103828651/)

- **目的**：省地方 -- 将设备信息与驱动分离的思维  
- **方式**：将驱动程序与硬件通过设备信息进行变量传递，提高代码普适性  
- **含义**：设备树中包含的就是设备的信息  
- **解决的问题**：同一个设备可以连接到不同的主机都需要更改驱动代码  
- **组成**：节点 + 属性  
- **文件**：
    - `.dto` - 对设备树进行叠加  
    - `.dtsi` - 共有的设备属性，类似于 include  
    - `.dts` - 描述设备信息  
    - `dtc` - 解析编译的工具文件  
    - `.dtb` - 完成编译后的二进制文件

## 要点

- 机制（需要提供什么功能）和策略（如何使用功能）进行分离
- 驱动程序就是实现机制，不可包含策略  

## [Linux](https://www.cnblogs.com/rex-2018-cloud/p/10443452.html) 内核的设备模型

- **组成**：
    1. Bus - CPU 与设备之间的通道
    2. Class - 集合有相似功能的设备
    3. Device - 所有硬件设备（类似于 Android 中的设备树）
    4. Device Driver - 驱动程序（设备初始化，电源管理接口）
- **核心逻辑**：
    1. 用 Device 和 Device Driver 描述硬件的“有什么用”和“怎么用”
    2. 通过 Device 和 Device Driver 的匹配，完成热插拔 -- 检测到相同的名字，就调用初始化函数 probe（在设备插入之后内核构建 Device 函数）
    3. 通过 “Bus --> Device” 解决设备之间的依赖，写驱动时告知内核设备的依赖项即可，由内核进行依赖项的调用
    4. 通过 Class 抽象共性，减少重复造轮子

## [Makefile](https://www.cnblogs.com/hbtmwangjin/articles/9012804.html)、Kconfig、.config

- **内涵**：Kconfig 是菜单，Makefile 是做法，.config 就是菜的 ==可变量==  
- **定义**：
    - Makefile：一个文本形式的文件，编译源文件的方法。  
    - Kconfig：一个文本形式的文件，内核的配置菜单。  
    - .config：编译内核所依据的配置  
- **Makefile**：
    1. 直接编译 - `obj-y += xxx.o`
    2. 条件编译 - `obj-$(CONFIG_HELLO) += xxx.o`
    3. 模块编译 - `obj-m += xxx.o` 执行 `make modules` 时才会编
- [Kconfig](https://blog.csdn.net/u011425939/article/details/80472324)：
	1. config条目--包含bool、tristate、string（具体菜名）
	2. menu条目--菜单栏（海鲜类，烧烤类）
	3. menuconfig条目--可配置的菜单栏
	4. choice条目--将类似的配置进行组合，供用户单选或多选
	5. comment条目--定义帮助信息
	6. source条目--读取另一个Kconfig文件
- 总结：
	- .config中存放着Makefile中的变量
	- Makefile包含编译项和编译逻辑
	- Kconfig是根据 .config的值，提取feature，对Makefile进行分类，实现automake/autoconfig  

## 高端内存

1. 背景：32位linux内核--虚拟地址空间为4G  
2. 划分：  
	- Kernel Space（1G）  
	- ZONE_DMA-16M  
	- ZONE_NORMAL-16M~896M  
	- ==ZONE_HIGHMEM-896M-1G==--动态地址随时待分配  
	- User Space（3G）  
3. 结论：
	1. 内核空间可访问==所有==的物理地址，前896M与物理地址一一对应
	2. 用户空间只能访问==3G==物理地址，且一一对应
	3. 当物理内存超过内核地址空间，就存在高端内存，==确保内核空间能够访问所有物理空间==
	4. 32位系统，User可访问3G，64位系统，User可访问512G