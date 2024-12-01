Camera_module_t->common.open()  
Hardware_device_t
 
Camera3_device:定义连接HAL与Framework/App之间的 输入/输出流  
Camera3_stream_type:  
定义相机hal设备是流的生产者还是输出者  
某个流的缓冲区与其他流的关系  
Camera3_stream_rotation:  
相机流的旋转需求  
Camera3_stream_configuration_mode:  
定义了hal的操作模式  
Cmaera3_stream  
Camera3_stream_configuration

# CHI-API

目的：是将变量从CAMX中抽离出来，从而在相机驱动程序中实现**自定义图像处理功能**  
注意：仍然通过CAMX进行相关node的调用