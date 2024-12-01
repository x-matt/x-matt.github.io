grid：V1-7*7，V2-13*13--也是输出的shape

- # V1
    

[https://zhuanlan.zhihu.com/p/37850811](https://zhuanlan.zhihu.com/p/37850811)  
[https://www.jianshu.com/p/cad68ca85e27](https://www.jianshu.com/p/cad68ca85e27)
 
一个cell只能预测一个物体--一张图最多7*7=49个物体  
输入：448*448，因为有FC，所以其输入必固定  
输出：7*7*30，前20个是类别  
先用2个box进行预测，跟truth计算，选iou大的进行预测  
分类部分的预测是共享的
 7. ## Confidence预测
    

训练阶段：物体中心在cell内==bb的中心的在cell内，则 pr(object)=1,confidence=1*IOU  
样本中的每个 Object 归属到且仅归属到一个grid，即便有时 Object 跨越了几个 grid， 也仅指定其中一个  
预测阶段：只输出confidence值，包含了IOU，就是训练时候的label
 10. ## BOX预测
    

xywh：xy是相对于左上角的偏移，都进行了归一化
 13. ## 类别预测
    

在confidence为1的基础上进行类别预测
 16. ## Loss
    

网络实际输出值与样本标签的偏差

![本 签 0 自 行 车 边 框 坐 标 坐 标 2 1 0 1 猫 bounding boxl bounding box2 网 络 0 · 2 预 测 边 框 坐 标 1 预 测 边 框 坐 标 2 0 · 03 0 · 1 0 ． 05 0 ． 7 ](Exported%20image%2020240403195655-0.png)  

组成：class loss，confidence loss，xywh loss  
若没有物体进入cell中心，只计算 clss loss
 
# V1
   

## Confidence预测
 
## BOX预测
 
## 类别预测
 
## Loss
 
# V2

- # V2
    

[https://zhuanlan.zhihu.com/p/40659490](https://zhuanlan.zhihu.com/p/40659490)

2. ## 网络骨架
    

抛弃了全连接层，改为全卷积层，所有输入可以**resize**成任意大小的图片  
每个卷积层后用了BN  
跨层连接--passthrough：先进行reorganization，一个feature map变成多个，通道数增加了
 5. ## 网络输出
    

13*13*1024  
再用1*1的卷积将1024压缩到 Num_Anchor*(4+1+class_num)
 8. ## 网络的预测
    

是在grid上预测的，要乘步长32到原尺度上(下采样32)  
后处理：NMS和confidence滤除不包含物体的预测
 11. ## 网络的训练
    

将anchor和gt_bbox移到左上角，计算IOU，最大的anchor预测该物体

1. anchor的xywh损失（不预测物体+预测物体）
2. anchor的confidence损失（不预测物体+预测物体）
3. 预测物体的anchor的类别损失---类别里面没有背景

多尺度训练：输入任意大小图片，grid也不是固定的
 
V3  
预测数 13*13*3+26*26*3+52*52*3=10627  
V2： 13*13*5=845
   

感受野：输出受到输入的影响范围（不是原图，是输入）

- # Focal Loss
    

前向梯度&后向梯度 [https://www.cnblogs.com/tectal/p/10655544.html](https://www.cnblogs.com/tectal/p/10655544.html)

1. 正样本(positive example)和负样本(negative example)的不平衡
2. 难样本(hard example)--[前景和背景连接处]和易样本(easy example)的不平衡
3. loss被负样本主导，被易样本主导，但重点是正样本和难样本 
标准交叉熵：

![—log (p) —log(l if y I Otherwise ](Exported%20image%2020240403195655-1.png)

α：解决正负样本不平衡

![Exported image](Exported%20image%2020240403195655-2.png)

γ：解决难易样本不平衡

![Exported image](Exported%20image%2020240403195655-3.png)  

## 网络骨架
 
## 网络输出
 
## 网络的预测

Anchor_size=5  
一个cell->5个anchor  
一个anchor->4+1+class_num
 
## 网络的训练

损失函数：
      

# Focal Loss

one-stage精度低的原因：