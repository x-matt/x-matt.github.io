
## Memory safety tools

![[2023-11-01-17-13-26.png|Android memory safety tools landscape|800]]

Android memory safety tools landscape

### [MTE](https://source.android.com/docs/security/test/memory-safety/arm-mte)

- 全称: Arm Memory Tagging Extension
- 目的: 提高计算机系统的安全性, 协助防止内存安全漏洞
- 原理: 适用额外的Meta来标记每次内存的分配和销毁, 运行期间, CPU会检测指针和Meta的记载是否一致
- 模式:
    1. SYNC
    1. ASYNC
    1. ASYMM - 非对称模式

### [Sanitizers](https://github.com/google/sanitizers#sanitizers)

Name                                                                                                | FullName                           | Usage
----------------------------------------------------------------------------------------------------|------------------------------------|------------------------------------
[ASan](https://github.com/google/sanitizers/wiki/AddressSanitizer#introduction)                     | Address Sanitizer                  | addressability issues
[LSan](https://github.com/google/sanitizers/wiki/AddressSanitizerLeakSanitizer#using-leaksanitizer) | Leak Sanitizer                     | memory leak
[MSan](https://github.com/google/sanitizers/wiki/MemorySanitizer)                                   | Memory Sanitizer                   | use of uninitialized memory
[HWASAN](https://clang.llvm.org/docs/HardwareAssistedAddressSanitizerDesign.html)                   | Hardware-assisted AddressSanitizer | update of ASan, consume less memory
[UBSan](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)                                | UndefinedBehaviorSanitizer         | undefined behavior

#### ASan

- 全称: Address Sanitizer
- 目的: 动态内存错误检测
- 适用范围: C/C++
- 组成: LLVM + 替换了的malloc
- 原理: 在编译时候插入特殊的代码来检测内存错误, 在程序运行时监视内存访问, 发生错误时报告问题
- 与HWASAN的差异: HWASAN需要依赖硬件, 无需修改代码, 速度更快, 性能更好

## 相关报错

- SIGSEGV[^1]: SIG 是信号名的通用前缀， SEGV 是segmentation violation，也就是存储器区段错误
- 原因:
    1. 访问空指针

        ```cpp
        char *c = NULL;
        ...
        *c; // dereferencing a NULL pointer
        ```

    1. 内存越界访问

        ```cpp
        char *c = "Hello";
        ...
        c[10] = 'z'; // out of bounds, or in this case, writing into read-only memory
        ```

    1. 访问已经释放的内存

        ```cpp
        char *c = new char[10];
        ...
        delete [] c;
        ...
        c[2] = 'z'; // accessing freed memory
        ```

- MTE的故障返回[^2]: SEGV_MTESERR(9) OR SEGV_MTEAERR(8)
- 拓展:
  - SIG类型查看: `adb shell kill -l` (进程间通信的信号)

[^1]:[什么是 SIGSEGV 以及导致报错的原因](https://blog.csdn.net/Lixiaohua_video/article/details/107067808)
[^2]:[了解 MTE 报告](https://source.android.com/docs/security/test/memory-safety/mte-reports?hl=zh-cn)
