==Python== ==--====version== ==查看版本信息==  
没有 x++ 和 x--  
用英语字母实现布尔运算and \or

- [https://zhuanlan.zhihu.com/p/20878530?refer=intelligentunit](https://zhuanlan.zhihu.com/p/20878530?refer=intelligentunit)
- ==基本数据类型==
- ==容器==
    
    1. ==列表====(====Lists====)==
        
        1. ==切片====(====slicing====)== ==print== ==aj====[2:4]==
        2. ==循环====(Loop====s)[====遍历列表====]== ==enumerate====用来访问每个元素的指针==
        3. ==列表推导==
            
            1. ==nums=[0,1,2,3,4]==
            2. ==squares=[x**2 for x in nums]==
            3. ==print squares==
    2. ==字典==
    
    ==用来储存（键====,== ==值）对==  
    d={'dog':'cute','monkey':'suck'}
    
    1. 循环 iteritems
    2. 字典推导
    
    5. ==集合== ==独立====不同====个体的无序集合==
    6. ==元组====(Tuples)== ==值的有序列表====(====不可改变====)==
    
    元组可以在字典中用作键，还可以作为集合的元素，而列表不行  
    ==t = (====5====,== ==6====)== ==建立一个元祖==
    
- ==函数== ==用== ==def== ==定义==
- ==类==

print d['dog']

# VIM

# VIM

2. **i** ==切换到输入模式，以输入字符。==
3. **x** ==删除当前光标所在处的字符。==
4. **:** ==切换到底线命令模式，以在最底一行输入命令。==

# Linux

# Linux

2. **Shift+ctrl+c** **复制**

**Shift+ctrl+v****粘贴**
    
# Numpy--n维数据容器

是python中用于科学计算的核心库，提供多维数组对象，以及相关工具  
导入模块numpy并以np作为别名 import numpy as np  
--建立数组  
a = np.array([1, 2, 3]) # Create a rank 1 array  
print type(a)

1. 访问数组 切片；整形数组(可用来更改某个元素)；布尔型
2. 数组计算 **T**来转置矩阵 dot进行矩阵乘法
3. 广播(Broadcasting) 让不同大小的矩阵进行数学计算
 
# Scipy--科学计算函数库

提供计算和操作数组的函数(与图像相关的操作函数)
 
# Pandas--表格容器

DataFrame的数据结构
  
# Jupyter 工作空间更改

jupyter notebook --generate-config
 > From <[https://blog.csdn.net/tina_ttl/article/details/51031113#22-%E6%96%B9%E5%BC%8F%E4%BA%8C%E7%BB%9D%E6%8B%9B%E7%BB%9D%E6%8B%9B](https://blog.csdn.net/tina_ttl/article/details/51031113#22-%E6%96%B9%E5%BC%8F%E4%BA%8C%E7%BB%9D%E6%8B%9B%E7%BB%9D%E6%8B%9B)>   
激活空间 activate base  
Jupyter notebook

# Python

数据主要分为：

- 整数型 ；数字的整数
- 浮点型； 数字带小数
- 字符串； 用 ‘’ 或者 “” 引用的任意文本
- 布尔型；只有 True 和 False

数据结构分为：

- 列表 list
- 元祖 tuple
- 字典 dict
- 集合 set