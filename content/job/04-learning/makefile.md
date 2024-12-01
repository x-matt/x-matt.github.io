## acp模块分析

```bash
LOCAL_PATH:= $(call my-dir)

# start
include $(CLEAR_VARS)

LOCAL_SRC_FILES := acp.c

LOCAL_STATIC_LIBRARIES := libhost
LOCAL_C_INCLUDES := build/libs/host/include
LOCAL_MODULE := acp
LOCAL_ACP_UNAVAILABLE := true

# end
include $(BUILD_HOST_EXECUTABLE)
```

含义：使用当前路径的acp.c源码，引用include和链接的library均为host模块，编译生成可执行文件，名称为acp

### Android.mk基本组成

#### 基础变量

变量                    | 说明
------------------------|-------------------------------------------
`LOCAL_PATH`            | 定义了当前模块的相对路径，必须出现在所有的编译模块之前
`include $(CLEAR_VARS)` | 是一个编译模块的开始，它会清空除LOCAL_PATH之外的所有 LOCA_XXX变量
`LOCAL_SRC_FILES`       | 定义了本模块编译使用的源文件，采用的是基于LOCAL_PATH的相对路径
`LOCAL_MODULE`          | 定义了本模块的模块名
`include $(BUILD_XXX)`  | 描述了编译目标
> 每个编译模块由`include $(CLEAR_VARS)` 开始，由`include $(BUILD_XXX)` 结束

#### 其他可选变量

变量|说明
-|-
`LOCAL_STATIC_LIBRARIES`| 表示编译本模块时需要链接的静态库
`LOCAL_C_INCLUDES`| 表示了本模块需要引用的include文件
`LOCAL_ACP_UNAVAILABLE`| 表示是否支持acp，如果支持acp，则使用acp进行拷贝，否则使用linux cp拷贝，本模块编译acp，当然是不支持acp了

### 编译目标

> build/core/config.mk

常用编译目标：

编译目标                  | 说明
--------------------------|------------
BUILD_HOST_STATIC_LIBRARY | 主机上的静态库
BUILD_HOST_SHARED_LIBRARY | 主机上的动态库
BUILD_HOST_EXECUTABLE     | 主机上的可执行文件
BUILD_STATIC_LIBRARY      | 目标设备上的静态库
BUILD_SHARED_LIBRARY      | 目标设备上的动态库
BUILD_EXECUTABLE          | 目标设备上的可执行文件
BUILD_JAVA_LIBRARY        | JAVA库
BUILD_STATIC_JAVA_LIBRARY | 静态JAVA库
BUILD_HOST_JAVA_LIBRARY   | 主机上的JAVA库
BUILD_PACKAGE             | APK程序
BUILD_PREBUILT            | 将文件作为编译项目

`LOCAL_PATH` 的定义必须要放到所有的`include $(CLEAR_VARS)`之前

## Reference

- [深入浅出Android makefile(1)--初探](https://blog.csdn.net/lizzywu/article/details/12835061)
- [深入浅出Android makefile(2)--LOCAL_PATH](https://blog.csdn.net/lizzywu/article/details/12835413)
- [深入浅出Android makefile(3)--LOCAL_SRC_FILES](https://blog.csdn.net/lizzywu/article/details/12842031)
