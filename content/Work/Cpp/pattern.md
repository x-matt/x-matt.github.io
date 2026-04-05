---
title: Design pattern
---
## 工厂模式
1. 创建对象时不暴露创建逻辑
1. 使用共同接口指向新创建的对象
1. 应用场景：创建复杂对象时

模式|产品数|工厂数|产品/工程
:-: | :-: | :-: | :-: 
简单工程 |多|1|多/1
工厂方法 |多|多|1/1
抽象工厂 |多|多|多/1

### 简单工程模式
1. 特点：在工厂类中作判断，增加新产品时，修改工厂类
2. 优点：只需要知道具体的产品型号就可以创建产品
3. 缺点：若产品量大，工厂类会臃肿

```cpp
/*
关键代码：创建过程在工厂类中完成
*/
​
#include <iostream>
​
using namespace std;
​
//定义产品类型信息
typedef enum
{
    Tank_Type_56,
    Tank_Type_96,
    Tank_Type_Num
}Tank_Type;
​
//抽象产品类
class Tank
{
public:
    virtual const string& type() = 0;
};
​
//具体的产品类
class Tank56 : public Tank
{
public:
    Tank56():Tank(),m_strType("Tank56")
    {
    }
​
    const string& type() override
    {
        cout << m_strType.data() << endl;
        return m_strType;
    }
private:
    string m_strType;
};
​
//具体的产品类
class Tank96 : public Tank
{
public:
    Tank96():Tank(),m_strType("Tank96")
    {
    }
    const string& type() override
    {
        cout << m_strType.data() << endl;
        return m_strType;
    }
​
private:
    string m_strType;
}; 
​
//工厂类
class TankFactory
{
public:
    //根据产品信息创建具体的产品类实例，返回一个抽象产品类
    Tank* createTank(Tank_Type type)
    {
        switch(type)
        {
        case Tank_Type_56:
            return new Tank56();
        case Tank_Type_96:
            return new Tank96();
        default:
            return nullptr;
        }
    }
};
​
​
int main()
{
    TankFactory* factory = new TankFactory();
    Tank* tank56 = factory->createTank(Tank_Type_56);
    tank56->type();
    Tank* tank96 = factory->createTank(Tank_Type_96);
    tank96->type();
​
    delete tank96;
    tank96 = nullptr;
    delete tank56;
    tank56 = nullptr;
    delete factory;
    factory = nullptr;
​
    return 0;
}
```

### 工厂方法模式
1. 定义创建对象的接口，由子类完成创建
2. 优点：增加新类，只需拓展相应的工厂类
3. 缺点：产品太多时，需要大量工厂类

```cpp
/*
关键代码：创建过程在其子类执行。
*/
​
#include <iostream>
​
using namespace std;
​
//产品抽象类
class Tank
{
public:
    virtual const string& type() = 0;
};
​
//具体的产品类
class Tank56 : public Tank
{
public:
    Tank56():Tank(),m_strType("Tank56")
    {
    }
​
    const string& type() override
    {
        cout << m_strType.data() << endl;
        return m_strType;
    }
private:
    string m_strType;
};
​
//具体的产品类
class Tank96 : public Tank
{
public:
    Tank96():Tank(),m_strType("Tank96")
    {
    }
    const string& type() override
    {
        cout << m_strType.data() << endl;
        return m_strType;
    }
​
private:
    string m_strType;
}; 
​
//抽象工厂类，提供一个创建接口
class TankFactory
{
public:
    //提供创建产品实例的接口，返回抽象产品类
    virtual Tank* createTank() = 0;
};
​
//具体的创建工厂类，使用抽象工厂类提供的接口，去创建具体的产品实例
class Tank56Factory : public TankFactory
{
public:
    Tank* createTank() override
    {
        return new Tank56();
    }
};
​
//具体的创建工厂类，使用抽象工厂类提供的接口，去创建具体的产品实例
class Tank96Factory : public TankFactory
{
public:
    Tank* createTank() override
    {
        return new Tank96();
    }
};
​
​
int main()
{
    TankFactory* factory56 = new Tank56Factory();
    Tank* tank56 = factory56->createTank();
    tank56->type();
    
    TankFactory* factory96 = new Tank96Factory();
    Tank* tank96 = factory96->createTank();
    tank96->type();
​
    delete tank96;
    tank96 = nullptr;
    delete factory96;
    factory96 = nullptr;
​
    delete tank56;
    tank56 = nullptr;
    delete factory56;
    factory56 = nullptr;
​
    return 0;
}
```

### 抽象工厂模式
1. 创建一系列接口，不指定具体的类
2. 应用场景：存在多个产品系列，但客户端只是用一个系列产品
3. 缺点：当增加一个新系列的产品时，不仅需要现实具体的产品类，还需要增加一个新的创建接口，扩展相对困难。

```cpp
/*
* 关键代码：在一个工厂里聚合多个同类产品。
* 以下代码以白色衣服和黑色衣服为例，白色衣服为一个产品系列，黑色衣服为一个产品系列。白色上衣搭配白色裤子，   黑色上衣搭配黑色裤字。每个系列的衣服由一个对应的工厂创建，这样一个工厂创建的衣服能保证衣服为同一个系列。
*/
​
//抽象上衣类
class Coat
{
public:
    virtual const string& color() = 0;
};
​
//黑色上衣类
class BlackCoat : public Coat
{
public:
    BlackCoat():Coat(),m_strColor("Black Coat")
    {
    }
​
    const string& color() override
    {
        cout << m_strColor.data() << endl;
        return m_strColor;
    }
private:
    string m_strColor;
};
​
//白色上衣类
class WhiteCoat : public Coat
{
public:
    WhiteCoat():Coat(),m_strColor("White Coat")
    {
    }
    const string& color() override
    {
        cout << m_strColor.data() << endl;
        return m_strColor;
    }
​
private:
    string m_strColor;
}; 
​
//抽象裤子类
class Pants
{
public:
    virtual const string& color() = 0;
};
​
//黑色裤子类
class BlackPants : public Pants
{
public:
    BlackPants():Pants(),m_strColor("Black Pants")
    {
    }
    const string& color() override
    {
        cout << m_strColor.data() << endl;
        return m_strColor;
    }
​
private:
    string m_strColor;
};
​
//白色裤子类
class WhitePants : public Pants
{
public:
    WhitePants():Pants(),m_strColor("White Pants")
    {
    }
    const string& color() override
    {
        cout << m_strColor.data() << endl;
        return m_strColor;
    }
​
private:
    string m_strColor;
};
​
//抽象工厂类，提供衣服创建接口
class Factory
{
public:
    //上衣创建接口，返回抽象上衣类
    virtual Coat* createCoat() = 0;
    //裤子创建接口，返回抽象裤子类
    virtual Pants* createPants() = 0;
};
​
//创建白色衣服的工厂类，具体实现创建白色上衣和白色裤子的接口
class WhiteFactory : public Factory
{
public:
    Coat* createCoat() override
    {
        return new WhiteCoat();
    }
​
    Pants* createPants() override
    {
        return new WhitePants();
    }
};
​
//创建黑色衣服的工厂类，具体实现创建黑色上衣和白色裤子的接口
class BlackFactory : public Factory
{
    Coat* createCoat() override
    {
        return new BlackCoat();
    }
​
    Pants* createPants() override
    {
        return new BlackPants();
    }
};
```

## 策略模式
1. 封装一系列算法，使算法独立于客户端变化
2. 优点：比`if...else`降低了复杂度，更容易维护
3. 缺点：需要定义大量策略类

### 传统的策略模式实现

```cpp
/*
* 关键代码：实现同一个接口。
* 以下代码实例中，以游戏角色不同的攻击方式为不同的策略，游戏角色即为执行不同策略的环境角色。
*/
​
#include <iostream>
​
using namespace std;
​
//抽象策略类，提供一个接口
class Hurt
{
public:
    virtual void blood() = 0;
};
​
//具体的策略实现类，具体实现接口， Adc持续普通攻击
class AdcHurt : public Hurt
{
public:
    void blood() override
    {
        cout << "Adc hurt, Blood loss" << endl;
    }
};
​
//具体的策略实现类，具体实现接口， Apc技能攻击
class ApcHurt : public Hurt
{
public:
    void blood() override
    {
        cout << "Apc Hurt, Blood loss" << endl;
    }
};
​
//环境角色类， 游戏角色战士，传入一个策略类指针参数。
class Soldier
{
public:
    Soldier(Hurt* hurt):m_pHurt(hurt)
    {
    }
    //在不同的策略下，该游戏角色表现出不同的攻击
    void attack()
    {
        m_pHurt->blood();
    }
private:
    Hurt* m_pHurt;
};
​
//定义策略标签
typedef enum
{
    Hurt_Type_Adc,
    Hurt_Type_Apc,
    Hurt_Type_Num
}HurtType;
​
//环境角色类， 游戏角色法师，传入一个策略标签参数。
class Mage
{
public:
    Mage(HurtType type)
    {
        switch(type)
        {
        case Hurt_Type_Adc:
            m_pHurt = new AdcHurt();
            break;
        case Hurt_Type_Apc:
            m_pHurt = new ApcHurt();
            break;
        default:
            break;
        }
    }
    ~Mage()
    {
        delete m_pHurt;
        m_pHurt = nullptr;
        cout << "~Mage()" << endl;
    }
​
    void attack()
    {
        m_pHurt->blood();
    }
private:
    Hurt* m_pHurt;
};
​
//环境角色类， 游戏角色弓箭手，实现模板传递策略。
template<typename T>
class Archer
{
public:
    void attack()
    {
        m_hurt.blood();
    }
private:
    T m_hurt;
};
​
int main()
{
    Archer<ApcHurt>* arc = new Archer<ApcHurt>;
    arc->attack();
​
    delete arc;
    arc = nullptr;
    
    return 0;
}
```

### 使用函数指针实现

```cpp
#include <iostream>
#include <functional> 
​
void adcHurt()
{
    std::cout << "Adc Hurt" << std::endl;
}
​
void apcHurt()
{
    std::cout << "Apc Hurt" << std::endl;
}
​
//环境角色类， 使用传统的函数指针
class Soldier
{
public:
    typedef void (*Function)();
    Soldier(Function fun): m_fun(fun)
    {
    }
    void attack()
    {
        m_fun();
    }
private:
    Function m_fun;
};
​
//环境角色类， 使用std::function<>
class Mage
{
public:
    typedef std::function<void()> Function;
​
    Mage(Function fun): m_fun(fun)
    {
    }
    void attack()
    {
        m_fun();
    }
private:
    Function m_fun;
};
​
int main()
{
    Soldier* soldier = new Soldier(apcHurt);
    soldier->attack();
    delete soldier;
    soldier = nullptr;
    return 0;
}
```

## 适配器模式
1. 将一个类的接口转化成希望的另一个接口，实现多个类协作
2. 缺点：过多使用适配器，让系统凌乱，不是很必要，可以不用适配器

### 使用符合实现适配器模式

```cpp
/*
* 关键代码：适配器继承或依赖已有的对象，实现想要的目标接口。
* 以下示例中，假设我们之前有了一个双端队列，新的需求要求使用栈和队列来完成。
  双端队列可以在头尾删减或增加元素。而栈是一种先进后出的数据结构，添加数据时添加到栈的顶部，删除数据时先删   除栈顶部的数据。因此我们完全可以将一个现有的双端队列适配成一个栈。
*/
​
//双端队列， 被适配类
class Deque
{
public:
    void push_back(int x)
    {
        cout << "Deque push_back:" << x << endl;
    }
    void push_front(int x)
    {
        cout << "Deque push_front:" << x << endl;
    }
    void pop_back()
    {
        cout << "Deque pop_back" << endl;
    }
    void pop_front()
    {
        cout << "Deque pop_front" << endl;
    }
};
​
//顺序类，抽象目标类
class Sequence  
{
public:
    virtual void push(int x) = 0;
    virtual void pop() = 0;
};
​
//栈,后进先出, 适配类
class Stack:public Sequence   
{
public:
    //将元素添加到堆栈的顶部。
    void push(int x) override
    {
        m_deque.push_front(x);
    }
    //从堆栈中删除顶部元素
    void pop() override
    {
        m_deque.pop_front();
    }
private:
    Deque m_deque;
};
​
//队列，先进先出，适配类
class Queue:public Sequence  
{
public:
    //将元素添加到队列尾部
    void push(int x) override
    {
        m_deque.push_back(x);
    }
    //从队列中删除顶部元素
    void pop() override
    {
        m_deque.pop_front();
    }
private:
    Deque m_deque;
};
```

### 使用继承实现适配器模式

```cpp
//双端队列，被适配类
class Deque  
{
public:
    void push_back(int x)
    {
        cout << "Deque push_back:" << x << endl;
    }
    void push_front(int x)
    {
        cout << "Deque push_front:" << x << endl;
    }
    void pop_back()
    {
        cout << "Deque pop_back" << endl;
    }
    void pop_front()
    {
        cout << "Deque pop_front" << endl;
    }
};
​
//顺序类，抽象目标类
class Sequence  
{
public:
    virtual void push(int x) = 0;
    virtual void pop() = 0;
};
​
//栈,后进先出, 适配类
class Stack:public Sequence, private Deque   
{
public:
    void push(int x)
    {
        push_front(x);
    }
    void pop()
    {
        pop_front();
    }
};
​
//队列，先进先出，适配类
class Queue:public Sequence, private Deque 
{
public:
    void push(int x)
    {
        push_back(x);
    }
    void pop()
    {
        pop_front();
    }
};
```

## 单例模式
- 保证一个类仅可以有一个实例化对象，并提供一个访问的全局接口
    - 单例类只能由一个实例化对象。
    - 单例类必须自己提供一个实例化对象。
    - 单例类必须提供一个可以访问唯一实例化对象的接口。

### 懒汉单例模式
- 不到万不得已就不去实例化类，即第一次用类才去实例化
- 针对访问量小，甚至不去访问的情况，采用懒汉

### 非线程安全的懒汉单例

```cpp
/*
* 关键代码：构造函数是私有的，不能通过赋值运算，拷贝构造等方式实例化对象。
*/
​
//懒汉式一般实现：非线程安全，getInstance返回的实例指针需要delete
class Singleton
{
public:
    static Singleton* getInstance();
    ~Singleton(){}
​
private:
    Singleton(){}                                        //构造函数私有
    Singleton(const Singleton& obj) = delete;            //明确拒绝
    Singleton& operator=(const Singleton& obj) = delete; //明确拒绝
    
    static Singleton* m_pSingleton;
};
​
Singleton* Singleton::m_pSingleton = NULL;
​
Singleton* Singleton::getInstance()
{
    if(m_pSingleton == NULL)
    {
        m_pSingleton = new Singleton;
    }
    return m_pSingleton;
}
```

### 线程安全的懒汉单例

```cpp
std::mutex mt;

class Singleton
{
public:
    static Singleton* getInstance();
private:
    Singleton(){}                                    //构造函数私有
    Singleton(const Singleton&) = delete;            //明确拒绝
    Singleton& operator=(const Singleton&) = delete; //明确拒绝

    static Singleton* m_pSingleton;
    
};
Singleton* Singleton::m_pSingleton = NULL;

Singleton* Singleton::getInstance()
{
    if(m_pSingleton == NULL)
    {
        mt.lock();
        if(m_pSingleton == NULL)
        {
            m_pSingleton = new Singleton();
        }
        mt.unlock();
    }
    return m_pSingleton;
}
```

### 返回一个reference指向local static对象

```cpp
class Singleton
{
public:
    static Singleton& getInstance();
private:
    Singleton(){}
    Singleton(const Singleton&) = delete;  //明确拒绝
    Singleton& operator=(const Singleton&) = delete; //明确拒绝
};
​
​
Singleton& Singleton::getInstance()
{
    static Singleton singleton;
    return singleton;
}
```

### 饿汉单例模式
- 在单例类定义的时候就进行实例化

```cpp
//饿汉式：线程安全，注意一定要在合适的地方去delete它
class Singleton
{
public:
    static Singleton* getInstance();
private:
    Singleton(){}                                    //构造函数私有
    Singleton(const Singleton&) = delete;            //明确拒绝
    Singleton& operator=(const Singleton&) = delete; //明确拒绝
​
    static Singleton* m_pSingleton;
};
​
Singleton* Singleton::m_pSingleton = new Singleton();
​
Singleton* Singleton::getInstance()
{
    return m_pSingleton;
}
```