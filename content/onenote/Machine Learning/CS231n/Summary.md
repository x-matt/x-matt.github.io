- 鲁棒性
    
    - 就是耐操性，环境对其影响不是很大，不会产生1对1的结果
      
    
- 逻辑回归与线性回归
    
    - 逻辑回归的因变量是离散的，线性回归的是连续的
    - [https://blog.csdn.net/u010692239/article/details/52345754](https://blog.csdn.net/u010692239/article/details/52345754)
   

- ==最大似然估计==
    
    - 通过事实，推断出最有可能的硬币情况，就是==最大似然估计====。==
    - ==最大似然估计的问题，就变成了求似然函数的极值==。
    - > 来自 <[https://www.zhihu.com/question/24124998/answer/242682386](https://www.zhihu.com/question/24124998/answer/242682386)>  
        

> 来自 <[https://www.zhihu.com/question/24124998/answer/242682386](https://www.zhihu.com/question/24124998/answer/242682386)>   
- 最小二乘法
    
    - 包含评分函数（线性回归）和损失函数（误差平方和最小）
      
    
- LSTM: long short-term memory
    
    - 与RNN相比加入了判断信息是否有用的cell
      
    
- 上帝视角
    
    - 传统的神经网络在空间和时间上进行扩展得到了CNN和RNN。
    - CNN用于图像识别space，RNN用于语音识别time
    - Input(特征)--评分函数(带权重的线性回归)：f=Wx+b--用损失函数评价线性回归的好坏--利用最优化求出损失函数的最小值
    - 将线性回归的函数转化成非线性分类器，就需要非线性激活函数进行调教即 逻辑回归(二元化)
    - 最优化的目的是更新W使损失值变小，更新过程利用了反向传播
    - 另一个好的思维框架 [https://blog.csdn.net/a790209714/article/details/78578279](https://blog.csdn.net/a790209714/article/details/78578279)
   

![对 抗 网 络 生 成 网 络 V.S. 无 限 人 脸 识 别 ， 物 品 迁 子 目 标 分 类 数 据 ？ 识 别 ， 场 景 识 别 ， 文 字 识 别 判 别 网 络 深 ， 更 宽 ， 更 复 杂 非 线 性 图 像 特 征 ， 线 性 卷 积 核 位 置 回 归 安 防 ， 目 标 检 测 CNN 回 归 网 络 自 动 驾 驶 时 如 归 Img Eb 外 部 、 或 化 CNN 记 忆 反 馈 观 察 、 视 频 GATE RNN LST M 分 类 or C 增 强 学 习 LSTM 卷 积 语 生 成 视 频 搜 索 ？ 围 棋 ， 德 州 扑 克 ， 自 动 翻 译 智 自 动 游 戏 图 片 标 注 能 对 话 看 图 ](Exported%20image%2020240403195634-0.png)