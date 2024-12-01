# Faster-R CNN

- # Faster-R CNN
    

[https://zhuanlan.zhihu.com/p/31426458](https://zhuanlan.zhihu.com/p/31426458)

![preview](Exported%20image%2020240403195654-0.jpeg)  
![preview](Exported%20image%2020240403195654-1.jpeg)  

## Conv layers

1. ## Conv layers
    
2. 包含13个conv、4个pooling、13个Reul
3. 尺寸只在pooling层减半
4. ## RPN
    
5. 总过程：**生成****anchors -> softmax****分类器提取****fg anchors -> bbox reg****回归****fg anchors -> Proposal Layer****生成****proposals**
6. 两个：分类--softmax & 位置
7. RPN的输入：VGG 16 conv5输入为256 channels，32倍下采样
8. 经过3*3卷积-增加鲁棒性，维度256不变
    
    - 分类：分为前景和背景两个scores，输出为2k
    - 位置：xywh四个值，输出为4k
9. 在合适的anchor中，随机选128个正和128个负
10. softmax：对每个anchor判定前景和背景，1*1*18，reshape是caffe，编译成适合二分类的状态
11. bbox：1*1输出36维度，[1,4*9,H,W]
12. Proposal layer：综合 位置 & 类别
    
    - 生成anchors，用xywh进行bbox回归
    - 提取scores排名前6000，提取修正后的前景anchors
    - 限定fg anchors为图像边界
    - 设阈值，剔除小的fg anchors
    - NMS
    - 再次排序取前300 的 fg anchors，作为proposal输出 14. ## ROL pooling
    

## RPN
 
## ROL pooling

[https://deepsense.ai/region-of-interest-pooling-explained/](https://deepsense.ai/region-of-interest-pooling-explained/)  
功能：收集proposal，计算proposal feature maps--后面是全连接层，需要统一  
解决问题：RPN出来的 proposal--（对应M*N的尺度）都是不同的，需要统一一下

- 将proposal降采样为M/16，N/16的尺度
- 将proposal对应的feature map区域分为池化网格
- Max pooling

不同的proposal输出统一的大小pool_x*pool_h ，样例是7*7
 
## Classification

1. ## Classification
    

分类：通过全连接层和softmax对proposal feature maps进行分类  
位置：再次进行位置回归，提高精度
   

# ResNet-FPN

- # ResNet-FPN
    

组成：  
自下而上：特征提取的过程-下采样，2-5层输出fenture map{4，8，16，32}  
自上而下：上采样，最近邻上采样-简单-参数少  
横连接：将上下采样的feature map进行融合，消除上采样的混叠效应  
大尺度的ROI要从低分辨率的feature map上切，小尺度的从高分辨率切
 
# Mask RCNN

- # Mask RCNN
    

[https://blog.csdn.net/u011974639/article/details/78483779?locationNum=9&fps=1](https://blog.csdn.net/u011974639/article/details/78483779?locationNum=9&fps=1)  
[https://www.cnblogs.com/wangyong/p/10614898.html](https://www.cnblogs.com/wangyong/p/10614898.html)  
改进：

1. rol align
2. 添加卷积层进行mask预测--输出为 k类*m*m

mask预测是进行语义分割，因为每个ROI只对应一个物体  
添加卷积是为了实现分割，但是loss用的是sigmoid二值交叉熵，训练时通过分类分支预测的类别来选择mask