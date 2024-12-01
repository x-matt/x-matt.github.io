1. ==简介==
2. ==损失函数可视化==
3. ==最优化==
4. ==策略#1：随机搜索==
5. ==策略#2：随机局部搜索==
6. ==策略#3：跟随梯度== _译者注：上篇截止处_
7. ==梯度计算==
8. ==使用有限差值进行数值计算==
9. ==微分计算梯度==
10. ==梯度下降==
11. ==小结==
    
    - 最优化是寻找能使得损失函数值最小化的参数的过程。
    - 随机搜索：从随机权重开始，然后迭代优化，以获取更低的损失值
        
        - 随机局部：第一个随机产生，然后+随机扰动delta
        - 跟随梯度：选择变化最大的方向，即梯度方向
    - 数值梯度法：一阶求导公式或者中心差值公式
        
        - ![Exported image](Exported%20image%2020240403195628-0.png)
        - 在梯度负方向上更新迭代，步长(**学习率**)是一个重要的超参数
    - 微分分析计算梯度：将损失函数进行微分，然后进行迭代

针对大量训练集，采用小批量数据梯度下降(mini-batch gradient descent)，当每个批量中只有一个样本时，就称作**随机梯度下降****(SGD)****stochastic**
 
[https://www.cnblogs.com/lliuye/p/9451903.html](https://www.cnblogs.com/lliuye/p/9451903.html)  
批量梯度下降：全局最优；计算次数为k次达到最优，每次计算m个量，计算量：**k*m**

![(for j 1) ](Exported%20image%2020240403195628-1.png)  

随机梯度下降：局部最优；每次固定计算m次

![repeat{ for (for j —0,1) ](Exported%20image%2020240403195628-2.png)

小批量梯度下降：

![repeat{ for (for j — Ek=i y(k) ](Exported%20image%2020240403195628-3.png)

[https://blog.csdn.net/uestc_c2_403/article/details/74910107](https://blog.csdn.net/uestc_c2_403/article/details/74910107)
 
BGD：m个样本，一起求平均取跟更新参数θ；  
SGD：m个样本，依次去更新参数θ  
MBGD：m个样本分成（n*batch_size），n个样本一次去更新θ，每次单个样本用BGD更新θ