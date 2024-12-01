Clipped from: [https://blog.csdn.net/one_super_dreamer/article/details/81611118](https://blog.csdn.net/one_super_dreamer/article/details/81611118)

## 继承和派生概述：

- 继承和派生是同一个过程从不同角的度看
    
    - 保持已有类的特性而构造新类的过程称为继承。
    - 在已有类的基础上新增自己的特性而产生新类的过程称为派生。
- 被继承的已有类称为基类（或父类）
- 派生出的新类称为派生类（或子类）
- 直接参与派生出某类的基类称为直接基类。
- 基类的基类甚至更高层的基类称为间接基类。

## 派生的目的

- 当新的问题出现，原有程序无法解决（或不能完全解决）时，需要对原有程序进行改造。
- 软件的可重用性

![单 继 承 时 派 生 类 的 定 义 语 法 class 派 生 类 ： 继 承 方 式 基 类 各 成 员 声 明 ； 例 class Derived: public Base public: Derived 0 ； -Derived 0 ； ](Exported%20image%2020240403195422-0.png) ![多 继 承 时 派 生 类 的 定 义 class 派 生 类 各 ： 继 承 方 式 1 基 类 名 1 ， 继 承 方 式 2 基 类 名 2 ， 成 员 声 明 ； 注 意 ： 每 一 个 “ 继 承 方 式 " ， 只 用 于 限 制 对 紧 其 后 之 基 类 的 继 承 · 例 class Derived: public Basel, private Base2 public: Deived 0 ； —Derived 0 ； https://blog. csdn. n e [ / 011 e ](Exported%20image%2020240403195422-1.png)

## 派生类的构成：

### 吸收基类成员：

- 默认情况下派生类包含了全部基类中除构造和析构函数之外的所有成员
- c++11规定可以用using语句继承基类构造函数

### 改造基类成员：

- 如果派生类声明一个和某基类成员同名的新成员，派生的新成员就隐藏或覆盖了外层同名成员

### 添加新的成员：

- 派生类增加新成员使派生类在功能上有所发展。
 
## 继承方式

### 不同继承方式的影响主要体现在：

- 派生类成员对基类成员的访问权限；
- 通过派生类对象对基类成员的访问权限。

### 三种继承方式：

- 公有继承
- 私有继承
- 保护继承

## 公有继承（public）：

- 继承的访问控制
    
    - 基类的public和protected成员：访问属性在派生类中保持不变；
    - 基类的private成员：**不可直接访问**。
- 访问权限
    
    - 派生类中的**成员函数**：可以直接访问基类中的**public**和**protected**成员，但不能直接访问基类的**private**成员；
    - 通过派生类的**对象**：只能访问**public**成员

举例：  
定义一个点类（Point）

![//Poi nt.h #ifndef POINT H #define POI NT H class Point { / ／ 基 类 ％ int 类 的 定 义 public: / / 公 有 丞 数 成 员 void initPoi nt(float × = 0 ， float y = 0 ） { this->x = × ； this- >Y = y;} void move(float offX, float offY) { x + = Off)(; y + = offY; } float getXO const { retu rn × ； } float getY() const { return y; } private: / / 私 有 数 据 成 员 float y; #endif //_POINT_H ](Exported%20image%2020240403195422-2.png)

定义一个矩形类（Rectangle）

![#include 叩 oi nt.h' class Recta ngle: public Point { / / 派 生 类 定 义 部 分 public: / / 新 公 有 函 数 成 员 void initRectangle(fIoat float float 嬲 float h) { (oitpoirf(x, y); / / 调 用 基 类 公 有 成 员 函 数 this->w = this->h float getH() const { return h; } float getW() const { return w; } private: / / 新 嚆 私 有 数 据 成 员 float W, h; ](Exported%20image%2020240403195422-3.png) ![#include "Rectang le.h" using na mespace std; int main() { Rectangle /ect; / / 定 义 Rectang 类 的 对 隙 rect.initRectangle(), 3 ， 20 10 ） ； / / 设 置 矩 形 的 数 据 rect.move(3,2); / / 移 动 走 形 位 置 cout < < "The data Of rect(x,y,w,h): “ < < endl; cout < < rect.getX() < < “ ， ． ／ / 输 出 矩 形 的 特 征 参 数 < < rect.getY() < < 。 < < rect.getW() < < “ < < rect.getH() < < endl; return 0 ； ](Exported%20image%2020240403195422-4.png)

## 私有继承（private）

- 继承的访问控制：
    
    - 基类的public和protected成员：**都以private身份出现在派生类中**； #important
    - 基类的private成员：不可直接访问。
- 访问权限：
    
    - 派生类中的成员函数：可以直接访问基类中的**public**和**protected**成员，但不能直接访问基类的**private**成员；
    - 通过派生类的对象：不能直接访问从基类继承的任何成员。

举例

![//Point.h #ifndef POINT H #define _POI NT_H class Point { / ／ 基 类 Point 类 的 定 义 public: / / 公 有 丞 数 成 员 void initPoi nt(float × = 0 ， float y = 0 ） { this->x = × ； this- >Y = y;} void move(float offX, float offY) { x + = OffX; y + = offY; } float getXO const { retu rn × ； } float getY() const { return y; } private: / / 私 有 数 据 成 员 float y; #endif //_POINT_H ](Exported%20image%2020240403195422-5.png) ![//RectangIe.h #ifndef RECTANGLE H #define RECTANGLE H #include “ Poi nt.h• class Recta ngle: private Point { / / 派 生 类 定 义 部 分 public: / / 新 公 有 函 数 成 员 void initRectangIe(fIoat float float w, float h) { 而 tPoint(), y); / / 调 用 基 类 公 有 成 员 函 数 this->w = w; this->h void move(float off)<, float offY) { Poi nt::move(off)<, offY); } float getX() const { retu rn Poi nt::getX(); } float getY() const { return Point::getY(); 一 } ](Exported%20image%2020240403195422-6.png) ![float getHO const { return h; } float getW() const { return w; } private: / / 新 嚙 私 有 数 据 成 员 float w, h; ](Exported%20image%2020240403195422-7.png) ![#include "Rectang 叵 using namespace Std; i nt main() { Rectang le r€ct; / / 定 义 Rectangle 类 的 对 隙 rect.ini tRectangle(), 3 ， 20 10 ） ； / / 设 置 矩 形 的 数 据 rect.move(3,2); / ／ 移 动 走 形 位 置 cout < < "The data Of rect(x,y,w,h): “ < < endl; cout < < rect.getX() < < “ 过 ／ / 输 出 矩 形 的 特 征 参 数 < < rect.getY() < < 。 < < rect.getW() < < “ < < rect.getH() < < endl; return 0 ； ](Exported%20image%2020240403195422-8.png)

## 保护继承（protected）

- 继承的访问控制
    
    - 基类的public和protected成员：都以protected身份出现在派生类中
    - 基类的private成员：**不可直接访问**
- 访问权限
    
    - 派生类中的成员函数：可以直接访问基类中的public和protected成员，但不能直接访问基类的private成员；
    - 通过派生类的对象：不能直接访问从基类继承的任何成员。

### protected成员的特点与作用

介于public和private之间的一种状态

- 对建立所在类对象的模块来说，它与private成员的性质相同。
- 对于其派生类来说，它与public成员的性质相同。
- 既实现了数据隐藏，有方便继承，实现代码重用。

![< 匚 0 0 ](Exported%20image%2020240403195422-9.png)

   
多继承举例

![class A { public. void setA(int); void showA() const; prlvate: Int a, class B { public: void setB(int); void showB() const, private: int b; class C 。 public A, private B { public: void setC(int, int, int); void showC() const private const: Int C; ](Exported%20image%2020240403195422-10.png) ![void A::setA(int 幻 { void B.:setB(int 幻 { void C::setC(int × ， int int 幻 《 / / 派 生 类 成 员 自 接 访 问 基 类 的 / ／ 公 有 成 员 setA(x); setB(y); ／ ／ 其 他 函 数 实 现 略 int main() { C obj, obj.setA(5); obj.showA(); ObjsetC(6,7,9); obj.showC(); / / obj.setB(6); 错 误 / / obj 、 showB(); 错 误 return 0 ](Exported%20image%2020240403195422-11.png)

   
//公有继承                      对象访问    成员访问  
public    -->  public              Y         Y  
protected -->  protected     N         Y  
private   -->  private             N         N  
   
//保护继承                      对象访问    成员访问  
public    -->  protected           N         Y  
protected -->  protected        N         Y  
private   -->  protected           N         N  
   
//私有继承                      对象访问    成员访问  
public    -->  private             N         Y  
protected -->  private          N         Y  
private   -->  private             N         N  
   
   
 

# 继承和派生

## 继承机制：

- 派生类继承了基类的所有数据成员和成员函数
- 一个基类可以派生出多个派生类
- 每个派生类可以作为基类再派生出新的子类
- 单继承
- 多重继承
- 派生类是基类的具体化
- # 基类是派生类的抽象
    

# class 派生类名：[继承方式]基类名

# { 派生类新增加的成员}

# 基类是派生类的抽象

# class 派生类名：[继承方式]基类名

# { 派生类新增加的成员}

# 派生类的构成：

# 从基类接受成员

- # 从基类接受成员
    
- # 调整从基类接受的成员
    
- # 在声明派生类时增加的成员
    

# 调整从基类接受的成员

# 在声明派生类时增加的成员

# 继承和组合：

# is-a：使用继承

- # is-a：使用继承
    
- # has-a：使用组合
    
- # 继承是纵向的
    
- # 组合是横向的
    

# has-a：使用组合

# 继承是纵向的

# 组合是横向的

教授是老师 （抽象的具体化）  
教授有生日属性（从属关系）