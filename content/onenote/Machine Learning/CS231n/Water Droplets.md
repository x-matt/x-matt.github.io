## Planning

- [x] Python  
- [x] Deep learning  
- [x] Pass IELTS  
- [x] Improve spoken english everyday  
- [x] Do some exercise(run morning)  
- [x] Finish project (capsule endoscopy)  
- [x] Learn more competition  
- [x] Communicate with more different people  
- [x] Learn more history to understand more

# 卷积 ：

分为离散和连续 例：两个筛子扔出来和为4

![— T)dr ](Exported%20image%2020240403195636-0.png)

# 张量：

[https://www.zhihu.com/question/23720923/answer/32739132](https://www.zhihu.com/question/23720923/answer/32739132)

- 用张量语言描述的物理定律自动保证了不随参考系变化的这一性质
- 用基向量与分量的组合来表示物理量(与参考系变化无关)
- 标量是零阶张量 1个分量
- 向量是一阶张量 3个分量和3个基向量-二维
- 矩阵是二阶张量 9个分量和9个基向量-三维
- 三阶张量有27个分量和27个基向量---彩色图像的表示-三维

# Regression

回归的发展历史：  
[https://blog.csdn.net/laputa_ml/article/details/80072570](https://blog.csdn.net/laputa_ml/article/details/80072570)  
真实值、测量值、均值：测量值通过回归操作得到与真实值逼近的均值，当测量次数无穷大时，均值与真实值相等  
线性回归：Regression towards the ==mean==（加权均值、等权均值）

- 插值函数(存在biase)→拟合→找最小偏差和偏差平方→最小二乘法(正交投影)→问题：拟合只是对已知点，对未知点还未知→提出回归
- 最小二乘针对的是误差独立分布时才有效，带权重的最小二乘-极大似然估计原理就能适应更多情况
- 回归不再是一种逼近，而是成为一种“估计量”，重心也转移到对估计量的评价上（基于统计学），回归提供了寻找数据之间联系的手段。
- 为了适应巨大的数据量，产生了无参函数模型---核估计、局部线性回归（只适用于“密集、大量”的数据）
- Additive model解决了高维非参数回归问题
- Spline regression 解决了稀疏数据的问题，penalized least square（惩罚最小二乘），只假定时二阶函数，对函数的二阶导数的积分进行惩罚，则返回三次样条函数
- 极大似然估计：通过事实推断出最有可能的条件情况，多次实验找最有可能的那个值，即求极值。

贝叶斯跟最大似然都会根据事实来调整参数，但是贝叶斯还要考虑更改完这种情况的可能性时多少。

# 迁移学习

- 站在巨人的肩膀上就是迁移学习
- 将一个领域的已经成熟的知识应用到其他的场景
- 避免了重复造轮子，即继承性加强
- 越抽象的概念越容易被迁移，其泛化能力也越强
 
监督学习、半监督、非监督  
训练的数据集里面标记的多少来区分
 
# 机器学习：

- 输入的多个特征就是离散而间断的规律
- 函数的作用就是压缩信息，将这些特征串起来，
- 实现准确分割的线就是规律
 
# Induction & deduction
 
人工智能是目的，机器学习是手段，通过三个主义来决定不同的学习方法
  
机器学习算法：解决的是ill-posed的问题，类型星座--组合优化  
传统算法导论：结局的是well-defined的问题，相对机械--凸优化  
学习=表示+评价+优化  
表示：模型是什么，神经网络/决策树  
评价：我们想要什么样的模型  
优化：学习过程的实施者