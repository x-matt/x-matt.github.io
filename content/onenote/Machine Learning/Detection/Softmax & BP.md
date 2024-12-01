[https://blog.csdn.net/chnguoshiwushuang/article/details/80514626](https://blog.csdn.net/chnguoshiwushuang/article/details/80514626)
 
# 逻辑回归--二分类

输入：x=w0+W1X1+…WnXn  
输出：y=0/y=1  
模型：sigmoid函数

![Exported image](Exported%20image%2020240403195717-0.png)

F(x)=a,其导数为 a(1-a)
 
# Softmax回归--多类

[https://blog.csdn.net/qian99/article/details/78046329](https://blog.csdn.net/qian99/article/details/78046329)--推导过程  
计算过程

![Exported image](Exported%20image%2020240403195717-1.png) ![• Softmax layer as the output layer So maxLa r 20 0.05 Probabilit 0.88 0.12 ](Exported%20image%2020240403195717-2.png)  

# BP

[https://www.cnblogs.com/wlzy/p/7751297.html](https://www.cnblogs.com/wlzy/p/7751297.html)

1. 基于上述的前向传播，得出各个Loss的偏导数的值
2. 利用学习率α更新权重
3. 输出层向隐藏层更新--只有一个误差反向传播
4. 隐藏层向隐藏层更新--有多个误差反向传播  
# Focal Loss 的BP推导

[https://blog.csdn.net/linmingan/article/details/77885832](https://blog.csdn.net/linmingan/article/details/77885832)