> [!caution] This page contained a drawing which was not converted.   

# Software：Adams

1. 添加约束，让其运动起来（end time：14.4s；step size：0.05；motor：720d*s/120r/min）
    
    1. 新建材料：AlumAlloy、Resin、Steel
    2. 添加约束（更改工作栅格），确保系统仅有一个自由度 TOOLS->MODEL VERIFY
    3. 添加弹簧
2. 添加摩擦力，重力，接触力，进行动力学仿真
3. 加入柔性肠道组织进行动力学仿真（刚-柔混合建模）
    
    1. 用ANSYS生成MNF的柔性文件（写一小章）
    2. 将MNF文件导入Adams中
    3. 添加约束条件
    4. 进行仿真
![Vd mus vs mus mud R damping exponent penetration depth stac c n dynamic friction vel. static friction coeff_ dynamic friction coeff- Coemcient of Restitution NImm N-sec/mm mm steel (Dry) Steel (Greasy) Steel (Greasy) Aluminum Aluminum (Dry) Aluminum (Dry) Aluminum (Greasy) Aluminum (Greasy) Aluminum (Greasy) Aluminum (Greasy) Acrylic Acrylic Acrylic Acrylic Acrylic Nylon Nylon Nylon Nylon Nylon Nylon Rubber (Dry) Rubber (DN) Rubber (DN) Rubber (DN) Rubber (DN) Rubber (DN) Rubber (DN) Rubber (Greasy) Rubber (Greasy) Rubber (Greasy) Rubber (Greasy) Rubber (Greasy) Rubber (Greasy) Rubber (Greasy) Rubber (Greasy) steel (Dry) Steel (G reasy) steel (Dry) Aluminum (Dry) Steel (Dry) Steel (Greasy) Aluminum (Greasy) Steel (Dry) Steel (Greasy) Aluminum (Dry) Acrylic Steel (Dry) Steel (Greasy) Aluminum (Dry) Aluminum (Greasy) Nylon steel (Dry) Steel (Greasy) Aluminum Aluminum (Greasy) ACryIiC Rubber CDry) steel (Dry) steel (Greasy) Aluminum (Dry) Aluminum (Greasy) Acrylic Nylon Rubber (Greasy) Steel (Dry) Steel (Greasy) Aluminum (DM Aluminum (Greasy) Acrylic Nylon Rubber (DV) 100000.000 100000.000 100000.000 35000.000 35000, 000 35000, 000 35000,000 35000, 000 35000.ooo 1150.000 1150000 1150.000 liso.ooo 1150000 3800000 3807.762 3800000 3800000 3800000 3800000 2855000 2855.000 2855.000 2855.000 2855.000 2855, 000 2855, 2855, 000 2855,000 2855000 2855.000 2855.000 2855.000 2855.000 2855.000 50000 so 000 50.000 28, 000 28, 000 28, 000 28, 000 28, 000 0680 0680 0 680 0680 L 520 IS20 IS20 L 520 1,520 1,520 0,570 0,570 0,570 0,570 0,570 0,570 0,570 0,570 0,570 0,570 0,570 0570 0570 0570 0 570 VS 0.1 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 10 0.3 0.08 0.08 0.25 0.25 0.08 0.05 o. 05 o. 05 o. 05 0.15 0.15 0.08 0.15 0.15 0.13 0.13 o _ 08 0.13 0.13 0.08 0.25 0.05 0.15 0.13 0.25 mud 0.25 0.05 0.05 0.05 0.03 0.03 0.03 0.03 0.1 0.1 0.05 0.09 0.09 0.05 0.09 0.03 0.09 0.55 0.25 0.05 0.03 0.09 0.43 0.25 0.05 043 0.15 0.15 0.15 0.20 0.20 0,20 0,20 0,20 0,20 0.20 oao 0.40 040 0.50 0.50 0.50 0.50 0.50 0.50 0,80 0.80 0.80 0.80 0,80 0,80 0.80 CCO 0.80 0.80 ](Exported%20image%2020240403195537-0.png)  
![Modify Contact Contact Name Contact Type I Flexible Body J Solid Force Display Normal Force Stiffness Force Exponent Damping Penetration Depth Friction Force Coulomb Friction Static Coefficient Dynamic Coefficient Stiction Transition Vel_ Friction Transition Vel_ CONTACT Flex 1 Flex Body to Solid FLEX BODY 1 SOLIDS Red Impact 2866.0 1.1 0.67 Coulomb On 0.26 0.2 0.1 10.0 OK Apply Close ](Exported%20image%2020240403195537-1.png)
 
# 后处理数据：（Adams2016 P99）

1. 模型调试
2. 实验验证
3. 设计方案改进
4. 结果显示（有接触和无接触）
    
    - Dynamics Angel
    - Dynamics Radius
    - Dynamics Force
    - Spring Deformation

GSTIFF求解器、I3

## 未与肠道接触：

时域动画

- leg与mover之间的接触力
- 腿部尖端的力
- 腿部尖端到装置中轴线的距离