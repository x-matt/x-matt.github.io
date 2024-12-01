## 0720

### Figo--函数拦截 [^1]

#### 分析问题

1. 通过`exception occurs`查找异常点（相机出错时的弹出框）
1. 针对`exception occurs`向上找`AEE_AED`
1. 找出对应的`tombstone`

#### 解决问题

1. 函数封装，无法查看内部结构的调用
1. 函数拦截
    1. 优先调用自己的so库，里面防止一样的函数接口，执行相关文件
    1. 在自己的so库中进一步调用原有的函数接口

```cpp{.line-numbers}
//这里加了一层start_routine，意图是在把创建后的线程id，还有start函数指针也打印出来。通过与pthread_create打印出来的start函数指针的对比，就能找到这个线程是被谁创建的
void* start_routine(void* targ) {
  struct threadArg *ptr = (struct threadArg *) targ;
  error_log("pid(%d,%d) is running %p", getpid(), gettid(), ptr->func);
  void* ret = ptr->func(ptr->arg);
  delete (struct threadArg *)targ;
  return ret;
}

// 自定义的pthread_create
int pthread_create(pthread_t* thread_out, pthread_attr_t const* attr,
                   void* (*start)(void*), void* arg) {
  //这里把调用者的信息保存下来，包括pid/tid，还有start函数指针
  error_log("pid(%d,%d) is creating pthread, start_routine %p", getpid(), gettid(), start);
  if (lib_pthread_create == NULL) {
    //从libpthread.so里面加载真正的pthread_create实现
    lib_pthread_create = (int (*)(pthread_t*, pthread_attr_t const*, void* (*start_routine)(void*), void*))dlsym(RTLD_NEXT, "pthread_create");
    if (lib_pthread_create == NULL)
      return EINVAL;
  }

  //将调用pthread_create的调用栈打印出来，这样就找到了线程是在哪被创建的
  if (g_init) {
    DumpBacktrace();
  }

  //调用真正的pthread_create实现
  struct threadArg* targ = new (struct threadArg);
  targ->func = start;
  targ->arg = arg;
  int fd = (lib_pthread_create(thread_out, attr, start_routine, targ));

  return fd;
}
```

进一步修改linker，保证被正常调用，优先调用自己的so库

```cpp{.line-numbers}
static ElfW(Addr) linker_main(KernelArgumentBlock& args, const char* exe_to_load) {
  if (strstr(exe_path.c_str(), "camerahalserver") != NULL) {
    needed_library_name_list.push_back("libc_kill.so");
    ++ld_preloads_count;
  }
}
```

### 刘争明

1. dump时开秒表记时
1. 通过申请的size大小，获取图片的stride和scanline

## MTK-0925

### ISP HIDL

#### 是什么

目前仅支持拍照，ISPHal里面只有P2C_Node

#### 为什么

1. 解决丢图的问题
    - Google拍照后立即点击Home键推出
1. 解决快拍问题
1. 解耦算法与平台

#### 怎么做

- CameraHal & ISPHal 共进程，异线程
  - CameraHal-增加TuningBuffer
- 时序过程
  - Open/Config
  - request
  - callback

### Tuning config & customization

### DebugLog

- requestNo
- captureInternet(1:preview，2:capture)
- trigger feature:MTK_FEATURE_MFNR  req#
- P1:ENQ R:205
- P1:DEQ R:205
- RootNode中做BSS BSS:skip frame count
- 根据ISP node:0/1/2 看是否上移，0未上移，1左2右
- process callback 表示算法跑完了
  >通过Appstreammgr返回的数据，一定是左边（AOSP）

## 功耗-廖宽龙

### DVFS

- 频率基于电压进行调试
- 每个电压值对应一定的频率范围
- 升频率时：先↑电压，后↑频率
- 降频率时：先↓频率，后↓电压

### 针对场景

- 长时间运行的场景
- open/close Camera 不需要进行功耗测试
- 测试周期-5 min
- 例：拍照-5 min，没隔10s拍一次

## JIIGAN-SAT

- 算法的变换
  - 放大
  - 平移
  - 旋转
- 标定数据
  - Focus----放大
  - 主点坐标

## MTK系列培训

### Tiny MiddleWare

#### Overview

purpose：
cross-platform

- android
- chrome
- linuxdevelop VaL2 driver

代码架构说明

repo name|Description & Purpose
-|-
quark/mtkcam-android|Camera aospspecific parts
quark/mtkcam-core|Camera core parts
qurak/mtkcam-hwcore|Camera HW core -In CCD / RED parts -MUST C-style
quark/mtkcam-interfaces|Interface of the mtkcam
quark/mtkcam-halif|MTK HAL Interface -Interfaces for customization zone

### customer EIS

1. Acc/Mag/Rot. Vector sensor type

### 深圳区域培训

个人：

- 能力圈内->做好自己，有效率
- 能力圈外->做好协同，有结果

[^1]:[函数拦截](https://wiki.n.miui.com/pages/viewpage.action?pageId=403239358) - Wiki - 王文飞
