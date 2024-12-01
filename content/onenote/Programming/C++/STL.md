# 组成

- 拿盆里的蔬菜来切---盆(容器)、蔬菜(数据)、拿(迭代器)、切(算法)
- 将蔬菜放入盆的过程就是数据结构完成的 - 容器：
    
    - 顺序容器--list、vector、deque
    - 容器适配器--stack、queue、priority_queue（拥有权值的队列）
- 迭代器：
    
    - 访问容器中数据的方法。类似于指针 ==it====每次调用之前都要先赋值==
- 算法：
    
    - 模板函数-用来操作容器中的数据。sort()用来处理 vector中 的数据
- 仿函数：
    
    - 使类看起来像函数
- 迭代适配器：
    
    - 类似于类的继承 与派生，适配器提供一个适配的接口
- 空间配置器：
    
    - 同上
 
# 顺序容器初始化

1. Vector
    
    1. vector<int> first;
    2. vector<int> second (4,100);
    3. vector<int> third (second.begin(),second.end());
    4. vector<int> fourth (third);
    5. int myints[] = {16,2,77,29};

vector<int> fifth (myints, myints + sizeof(myints) / sizeof(int) );

3. List
    
    1. list<int> first;
    2. list<int> second (4,100);
    3. list<int> third (second.begin(),second.end());
    4. list<int> fourth (third);
    5. int myints[] = {16,2,77,29};
    
    list<int> fifth (myints, myints + sizeof(myints) / sizeof(int) );
    
4. Deque
    
    1. deque<int> first;
    2. deque<int> second (4,100);
    3. deque<int> third (second.begin(),second.end());
    4. deque<int> fourth (third);
    5. int myints[] = {16,2,77,29};
    
    deque<int> fifth (myints, myints + sizeof(myints) / sizeof(int) );
        

二维数组的申明：  
vector<vector<int> > matrix (val,vector<int> (val,0 ) );  
matrix.size();  
matrix[0].size();