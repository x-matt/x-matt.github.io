CNN：可以实现分类，但无法检测，在末端添加全连接层（FC layers），实现回归于分类  
特点：自动学习特征；学习多个层次的特征；浅层的感知域小；输入的图像尺寸固定  
FCN：实现了对图像的像素级分类，从而解决了语义分割  
反卷积层对feature map进行上采样->恢复到输入尺寸->实现对每个像素的预测->逐个像素计算softmax损失  
[https://blog.csdn.net/xiaojiajia007/article/details/54944023](https://blog.csdn.net/xiaojiajia007/article/details/54944023)
 
缩小图像：下采样/降采样  
目的：使图像符合区域大小；生成缩略图  
放大采样：上采样/图像插值  
目的：放大原图像--显示在更高分辨率设备上
 
全连接层（FC Layers）：卷积是局部特征，需要全连接进行特征整合