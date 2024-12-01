目的：实现多进程间的通信 IPC（Inter-Process Communication）  
IPC原理：

1. 进程在用户空间不共享，在内核空间共享
2. 用户空间与内核空间通过ioctl（input/output control）进行交互
![Exported image](Exported%20image%2020240403195508-0.png)      

原理：  
C/S架构  
Client、Server、Service Manager、Binder Driver

![Exported image](Exported%20image%2020240403195508-1.png)  

用户空间的进程实现信息交互---Binder
 
AIDL是binder向外提供的结构，方便调用binder