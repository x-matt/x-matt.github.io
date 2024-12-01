> [!caution] This page contained a drawing which was not converted.   

# 整体思路

整体尺寸：39.5*14.4  
丝杠长度23 直径3mm（选用与电机配套的也可以）
 
后期实验需要透明亚克力管 内径25mm*20cm  
直径0.8的细铁丝

# 零件表

- 丝杠电机：

购置（导程18mm）整体尺寸38mm  
[https://item.taobao.com/item.htm?spm=a1z09.2.0.0.3f322e8dZnN9Ix&id=571559413472&_u=l1jjtq98cdfe](https://item.taobao.com/item.htm?spm=a1z09.2.0.0.3f322e8dZnN9Ix&id=571559413472&_u=l1jjtq98cdfe)

![电 机 类 型 ： 2 相 4 线 制 驱 动 电 压 ： 5v / 500mA （ 电 压 丝 杆 长 度 ： 25mm 螺 母 厚 度 ： 2.5mm 电 机 直 径 ： 10mm 丝 杆 直 径 ： 3mm 丝 杆 螺 距 ： 0.5mm 步 距 角 ： 篁 8 。 相 电 阻 ： 10 ． 5 欧 整 本 尺 寸 ： 38 * 17 ． 7 12mm ](Exported%20image%2020240403195534-0.png)- holder：3D打印

厚度2.4mm 相对mover的移动距离3.6mm ==8==

- leg*3：3D打印 长度待定

==尾部可以增加一段直的（与外壳平行的一小段），尖端用热熔胶==

- mover：3D打印

厚度：大圆柱1mm，小圆柱1mm

- spring：选购 长度16mm

丝杠：铝  
7075铝合金  
泊松比： 0.33

![• • • • • • MPa) : 572 MPa): 503 71 11 150 EE(20'C) (g,'cm3): 2.82 (20-100'C) um/m.k :23.6 : 475-635 (680F) (%ACS) : 33 (680F) mnt/m: 0.0515 ](Exported%20image%2020240403195534-1.png)

树脂参数  
密度 1.2 g/cm3 = 1.2E-006 kg/mm3

![• • • • • • • • • • • (0.46MPa) (ASTM Method D648) (1.8 MPa) (ASTM Method D648 ) (Shore D) (ASTM Method D2240) : 79 (ASTM Method D638M) : 35 MPa (ASTM Method D638M) : 6 - 9% : 46'C : 41 OC (ASTM Method D638M) (ASTM Method D790M) (ASTM Method D790M) . 2370 - 2650 MPa . 67 MPa . 2178 - 2222 MPa (ASTM Method D256A) : 23 - 29 J/m (ASTM Method D570-98) : 0.4% (ASTM Method D638M) : 0.41 60 Hz (ASTM Method DI 50-98) . 3.8 1 KHz (ASTM Method D150-98) : 3.7 1 MHz (ASTM Method DI 50-98) : 3.4 (ASTM Method D149-97A) : 17.9 kV/mm ](Exported%20image%2020240403195534-2.png)

# 加工完成后的参数

## 撑开最大外径

25.2mm（未加腿部尖端）

## 弹簧参数

材料：304不锈钢  
尺寸：0.2*4*16  
N=10 Nc=N-2=8  
F=kx  
F=弹力  
k=刚性系数  
x=压缩量

![Gxd4 k: 8xDm3xNc ](Exported%20image%2020240403195534-3.png)

$k=\frac { G\times { d }^{ 4 } }{ 8\times { Dm }^{ 3 }\times Nc }$
 ![8x3.83x8 ](Exported%20image%2020240403195534-4.png)

$k=\frac { 7500\times { 0.2 }^{ 4 } }{ 8\times { 3.8 }^{ 3 }\times 8 } =3.417\times { 10 }^{ -3 }({ kgf }/{ mm })=0.0335N/mm\\ F=k\times x=0.0335\times 12=0.402N$
 
## 实验需求

磁铁 内径15mm，外径<24mm，长度2mm  
透明塑料管 直径26mm, 20mm，28mm，长度20cm