---
title: C++ basic knowledge
---
## C++特性
1. 封装：隐藏实现细节，使得代码模块化
1. 继承：使用现有类的所有功能，进行功能拓展。从一般到特殊的过程，称为“子类”和“父类”。
1. 多态：将父对象设置成为和一个或多个他的子对象相等的技术。允许将子类类型的指针赋值给父类类型的指针。**将父类暴露给用户子类隐藏，子类指针转化成父类指针进行返回，可实现程序的简易替换，背后的运作原理通过子类进行切换**。
> 上述特性最终目的是实现一个接口的复用性

## 多态
### 多态的分类
- 静态多态（编译时候 - 早绑定）
    1. 函数重载
        - 解释：一词多义，通过上下文来确定同名函数的重载版本
        - 应用场景：上下文的关键：参数个数、参数类型，参数顺序（与返回值、参数名 无关），三个中至少有一个不同
        - 多个功能类似的函数，可以共用一个函数名
        - e.g. print(int, chr), print(int, int)
    1. 函数模板
        - 解释：将使用多的场景的抽象为泛型
        - 应用场景：仅仅支持，参数**个数相同**且参数**类型不同**的情况
        - e.g. print(T, T)  仅仅单个类型（比重载的抽象程度更高）
- 动态多态（运行时候 - 晚绑定）
    - 添加`virtual`关键字，虚函数实现

### 多态的实现
  
```cpp
#include <iostream>

class Person
{
public:
    virtual void BuyTicket(int)
    {
        cout << "Adult need Full Fare!" << endl;
    }
};

class Child : public Person
{
public:
    virtual void BuyTicket(int)
    {
        cout << "Child Free!" << endl;
    }
};

void fun(Person& obj)
{
    obj.BuyTicket(1);     
}

int main(void)
{
    Person p;
    Child c;

    fun(p);
    fun(c);

    return 0;
}
```

>[!info] Output
>   
>    Adult need Full Fare!  
>    Child Free!

>[!warning] Hint
> 1. 只有类的成员函数才能说明为虚函数
> 1. 静态成员函数不能是虚函数
> 1. 内联函数不能为虚函数
> 1. 构造函数不能是虚函数
> 1. 析构函数可以是虚函数，而且通常声明为虚函数


## C++与C的区别
1. C 是面向过程的语言C++是面向对象的语言
1. C 中函数不能进行重载C++函数可以重载
1. C 函数的参数如果没有写void 即是可变参数。如C 中`int sum()`可接收任意参数;而C++中`int sum()`则表示输入参数为空
1. C 中struct中不能有函数C++中可以有函数
1. C++中`try/catch/throw`异常处理机制取代了C 中的`setjmp()`和`longjmp()`函数。
1. C++中，仍然支持`malloc()`和`free()`来分配和释放内存，同时增加了`new`和`delete`来管理内存。

## `malloc/free`和`new/delete`区别
1. `malloc`和`free`都是C/C++语言的标准库函数，`new/delete`是C++的运算符。
1. `new` 在申请内存时会自动根据类型计算所需字节数，而`malloc`则需我们自己输入申请内存空间的字节数
1. 对于非内部数据类型，`new`在申请内存后会在该申请的内存上调用构造函数，`delete`在释放内存前会调用对象的析构函数，而`malloc`和`free`只申请和释放内存。

## C++存储
1. 栈：编译器自动分配和清除，局部变量和函数参数
1. 堆：由 `malloc` 等分配的内存块
1. 自由存储区：由 `new` 分配的内存块，程序结束后，系统可以自动回收内存，与堆类似 
1. 全局/静态存储区：全局变量和静态变量
1. 常量：放置常量，不允许修改

## Static变量
1. static全局变量与普通的全局变量有什么区别：static全局变量只初使化一次，防止在其他文件单元中被引用
1. static局部变量和普通局部变量有什么区别：static局部变量只被初始化一次，下一次依据上一次结果值
1. static函数与普通函数有什么区别：static函数在内存中只有一份，普通函数在每个被调用中维持一份拷贝

## `extern "C"` 的修饰作用
1. 被`extern "C"`修饰的变量和函数是按照C 语言方式编译和连接的
1. `extern "C"`的作用是让C++ 编译器将`extern "C"`声明的代码当作C 语言代码处理，可以避免C++因符号修饰导致代码不能和C 语言库中的符号进行链接。

## 智能指针
1. 目的：管理堆内存，利用对象离开作用域自动析构的特性，将释放内存的操作托管给一个对象。
1. 引用计数（`shared_ptr`）：
    1. 基本思想：对被管理的资源进行引用计数，当一个shared_ptr 对象要共享这个资源的时候，该资源的引用计数加1，当这个对象生命期结束的时候，再把该引用计数减少1。这样当最后一个引用它的对象被释放的时候，资源的引用计数减少到0，**此时释放该资源**。
    1. 作为函数参数：传值则引用计数加1，传引用则引用计数不变
    1. 作为函数返回值：如果返回值作为右值进行拷贝，则引用计数加1，否则不变
1. `weak_ptr`是为了解决循环引用的问题，当两个对象互相引用时，计数无法降为0，`weak_ptr`不改变计数。

## 深拷贝和浅拷贝[^1]
1. 浅拷贝时一般调用的是默认构造函数，拷贝完指向同一块存储空间
1. 深拷贝时调用自定义的构造函数，指向其他存储空间，对象中包含指针时用深拷贝

## 内联函数与宏定义的区别
- 使用场景：函数简短，调用次数多。
- 内联函数和宏定义区别：
  1. 内联函数在编译时展开，而宏在预编译时展开
  1. 在编译的时候，内联函数直接被嵌入到目标代码中去，而宏只是一个简单的文本替换。
  1. 内联函数可以进行诸如类型安全检查、语句是否正确等编译功能，宏不具有这样的功能。
  1. 宏不是函数，而inline 是函数

## 什么是RTTI(Run-time type identification)
1. 概念：运行时类型识别
1. 作用：C++在运行时不能更改数据类型，为了满足这一要求，添加了RTTI机制
1. `typeid`和`dynamic_cast`：通过`typeid(a).name()`可知道变量a的类型

## 结构体和联合体的区别
1. 内存上：struct 的内存大小为所有成员变量所占内存之和（对齐原则），union 的内存大小为最长成员变量的内存大小。
1. 成员变量上：struct 各个成员变量按照被声明的顺序依次存储，第一个成员变量的地址与整个结构体的相同，成员独自占有内存空间，赋值互不影响；union 的所有成员变量共用同一段内存，某一变量的改变会覆盖处于内存起始位置的变量值，变量之间相互影响。

## STL中实现了哪些排序算法

| 函数名            | 定义                                     |
|:------------------|:---------------------------------------|
| sort              | 对给定区间所有元素进行排序（不稳定）       |
| stable_sort       | 对给定区间所有元素进行稳定排序           |
| partial_sort      | 对给定区间所有元素部分排序               |
| partial_sort_copy | 对给定区间复制并排序                     |
| nth_element       | 找出给定区间的某个位置对应的元素         |
| is_sorted         | 判断一个区间是否已经排好序               |
| partition         | 使得符合某个条件的元素放在前面           |
| stable_partition  | 相对稳定的使得符合某个条件的元素放在前面 |

## 各种排序方法的性能

| 排序法     | 平均时间复杂度   | 最好情况         | 最坏情况         | 空间复杂度       | 稳定度 |
|:--------|------------------|:-----------------|------------------|:-----------------|-----:|
| 插入排序   | O($$n^{2}$$)     | O($$n$$)         | O($$n^{2}$$)     | O($$1$$)         |   稳定 |
| 希尔排序   | O($$n^{1.3}$$)   | O($$n$$)         | O($$n^{2}$$)     | O($$1$$)         | 不稳定 |
| 选择排序   | O($$n^{2}$$)     | O($$n^{2}$$)     | O($$n^{2}$$)     | O($$1$$)         | 不稳定 |
| 堆排序     | O($$nlog_{2}n$$) | O($$nlog_{2}n$$) | O($$nlog_{2}n$$) | O($$1$$)         | 不稳定 |
| 冒泡排序   | O($$n^{2}$$)     | O($$n$$)         | O($$n^{2}$$)     | O($$1$$)         |   稳定 |
| 快速排序   | O($$nlog_{2}n$$) | O($$nlog_{2}n$$) | O($$n^{2}$$)     | O($$nlog_{2}n$$) | 不稳定 |
| 归并排序   | O($$nlog_{2}n$$) | O($$nlog_{2}n$$) | O($$nlog_{2}n$$) | O($$n$$)         |   稳定 |
| 二叉树排序 | O($$n^{2}$$)     | O($$n^{2}$$)     | O($$nlog_{2}n$$) | O($$n$$)         | 不稳定 |

## C++的数据类型
- 1 字节 = 8 位
- C++语言规定一个int 至少和一个short 一样大，一个long 至少和一个int 一样大，一个long long至少和一个long 一样大。
- 32位或64位系统下int的长度为4字节，最小可访问单位为 1 字节

| 类型      | 含义         | 最小尺寸      |
|:----------|------------|:-------------|
| bool      | 布尔类型     | 未定义        |
| char      | 字符         | 8 位          |
| wchar_t   | 宽字符       | 16 位         |
| short     | 短整型       | 16 位         |
| int       | 整型         | 16 位         |
| long      | 长整型       | 32 位         |
| long long | 长整型       | 64 位         |
| float     | 单精度浮点数 | 6 位有效数字  |
| double    | 双精度浮点数 | 10 位有效数字 |

## Const 常量的状态
1. `char * const cp` ：cp is a const pointer to char
1. `const char * p`：p is a pointer to const char

## C++11的特性
1. 关键词及新语法：auto 关键字、nullptr 关键字、基于范围的for 语句
1. STL 容器：array、forward_list、unordered_map、unordered_set、
1. 多线程：thread、atomic、condition_variable、
1. 智能指针内存管理：shared_ptr、weak_ptr
1. 其他：funciton、bind 封装可执行对象、lamda 表达式、move 等。
1. 新的整型long long/unsigned long long(长度不小于64 位)
1. final 和override 控制， final 用来限制基类虚函数的对应的派生类不能重写该虚函数，从而避免了某些接口被重写覆盖；override 则指定了函数必须重载基类的虚函数，否则编译通不过，这就避免了某些输入名或者原型不匹配等错误的发生。
1. 默认的模板参数，C++11 中模板和函数一样，支持默认参数。
1. 在传统C++ 的编译器中，`>>`一律被当做右移运算符来进行处理。C++11 开始，连续的右尖括号将变得合法，并且能够顺利通过编译。

## 内联函数、构造函数、静态成员函数可以是虚函数么
首先虚函数是针对对象而言，在运行时候才进行动态联编的。
- 内联函数是在编译阶段进行展开，inline 关键字作为提示符告诉编译器此函数作为内联函数希望在编译阶段展开，但是，编译器并不一定要展开。所以可以声明为虚函数。（这个问题有争执，很多帖子都说在编译器展开这个属性和虚函数冲突了，是不可以的，牛客网上有一个说是不一定要展开，但是没有一个固定的标准。）
- 构造函数无法是虚函数，因为调用虚函数需要虚函数表指针，而在执行构造函数之前是没有虚函数表指针的。
- 静态成员函数不可以是虚函数。静态函数是属于类的，不属于对象本身，自然无法有自己的虚函数表指针。

## 4种类型转换
- **static_cast< type-id >( expression )**
    1. 用于数值类型之间的转换，也可以用于指针之间的转换，编译时已经确定好，效率高，但需要
保证其安全性。
        1. 指针要先转换成void 才能继续往下转换。
        1. 在基类和派生类之间进行转换（必须有继承关系的两个类）
    1. 子类对象可以转为基类对象(安全)，基类对象不能转为子类对象(可以转换，但不安全，dynamic_cast 可以实现安全的向下转换)。
    1. static_cast 不能转换掉expression 的const、volatile、或者__unaligned 属性
- **dynamic_cast < type-id> ( expression )**
    1. 将父类对象的指针转化为子类对象的指针或引用
    1. dynamic_cast 只用于含有虚函数的类
    1. 先检查是否能转换成功，能成功则转换，不能返回0
类的指针或引用。
- **const_cast < type-id> ( expression )**
    1. 这个转换类型操纵传递对象的const 属性，或者是设置或者是移除。
- **reinterpret_cast < type-id> ( expression )**
    1. 用在任意指针类型之间的转换；以及指针与足够大的整数类型之间的转换，从整数到指针，无视大小。

## STL中常用容器的初始化
1. Vector
	```cpp
	vector<int> first;
	vector<int> second (4,100);
	vector<int> third (second.begin(),second.end());  
	vector<int> fourth (third);
	int myints[] = {16,2,77,29};
	    vector<int> fifth (myints, myints + sizeof(myints) / sizeof(int) );
	```
1. List
	```cpp
	list<int> first;                               
	list<int> second (4,100);                       
	list<int> third (second.begin(),second.end());  
	list<int> fourth (third);                     
	int myints[] = {16,2,77,29};
	    list<int> fifth (myints, myints + sizeof(myints) / sizeof(int) );
	```
1. Deque
	```cpp
	deque<int> first; 
	deque<int> second (4,100);          
	deque<int> third (second.begin(),second.end()); 
	deque<int> fourth (third);                      
	int myints[] = {16,2,77,29}; 
	    deque<int> fifth (myints, myints + sizeof(myints) / sizeof(int) );
	```

## 二维数组的申明
  
```cpp
vector<vector<int> > matrix (val, vector<int> (val, 0));
    matrix.size();
    matrix[0].size();
```

[^1]:[C++面试题之浅拷贝和深拷贝的区别_深拷贝和浅拷贝的区别c++-CSDN博客](https://blog.csdn.net/caoshangpa/article/details/79226270)