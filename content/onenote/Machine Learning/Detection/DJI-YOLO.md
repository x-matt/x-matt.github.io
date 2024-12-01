# 制作VOC数据集

[https://blog.csdn.net/kebijuelun/article/details/84772537](https://blog.csdn.net/kebijuelun/article/details/84772537)

- jpg格式图片，视频截取，1s截取一张 共1400张，取了10个验证集
- Rename
- LabelImg进行标注
- 利用XML文件生成trainval.txt,test.txt
 
# Yolo里面的预处理

代码注释： [https://blog.csdn.net/tanhongxi0027/article/details/73222024](https://blog.csdn.net/tanhongxi0027/article/details/73222024)

- resize、旋转角度、
- 调整饱和度、调整曝光量、调整色调
 
# 测试优化

改width和height  
关闭预览窗口可以提升速度：src/demo.c中的279行 cvResizeWindow  
修改摄像头分辨率
 
# 训练Trick

[https://blog.csdn.net/xiao__run/article/details/78787121](https://blog.csdn.net/xiao__run/article/details/78787121)  
batch减小，subvision增大，越省内存，但batch越大，训练效果越好  
关闭多尺度训练：random=0  
出现nan的情况，增加batch，动力参数调为0.99->逼近1
 
YOLOV2 3帧  
Tiny-YOLO 15帧 优化完大概26帧-实时
 
VOC数据集：分类、检测、分割、动作分类  
COCO数据集：场景理解为主 91类  
目标检测、图像标注、人体关键点检测  
[https://www.cnblogs.com/pprp/p/9629752.html#pascal-voc-coco%E6%95%B0%E6%8D%AE%E9%9B%86%E4%BB%8B%E7%BB%8D](https://www.cnblogs.com/pprp/p/9629752.html#pascal-voc-coco%E6%95%B0%E6%8D%AE%E9%9B%86%E4%BB%8B%E7%BB%8D)