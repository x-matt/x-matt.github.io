---
title: C++ I/O
tags: []
---
### 输入连续数进入vector

```cpp
vector<int> a;
int num,i=0;
int temple;

cin >> num;
while (i<num)
{
    cin >> temple;
    a.push_back(temple);
    i++;
}
```

### 迭代器输出vector

```cpp
for (vector<int>::iterator it = a.begin();it != a.end();++it)
    cout<< *it<< ' ';
cout << endl;
```

### 输出二维vector

```cpp
for (int i = 0;i < res.size();i++)
{
    for (int j = 0;j < res[i].size();j++)
        cout << res[i][j] << " ";
    cout << endl;
}
cout << endl;
```

### 输入多行字符串

```cpp
string s;
vector <string> a;
int num;
cin >> num;
cin.ignore();

while (num--)
{
    getline(cin, s);
    a.push_back(s);
}

for (int i=0;i<a.size();i++)
    cout << a[i] << endl;
cout << endl;
```

### 数组（vector）与字符串（string）相互转化

```cpp
string s;
char ch;
int tmp;
vector<int> b;
vector<int> a{1,3,7,6};
for (int i = 0;i < a.size();i++)
{
    ch = a[i]+'0';
    s += ch;
}
    
for (int i = 0;i < s.size();i++)
{
    tmp = s[i]-'0';
    b.push_back(tmp);
}
```

### 申请动态空间

```cpp
int *p=new int;
delete p;
int *p=new int(10);
delete p;
int *p=new int[10]; 
delete [] p;
p=NULL;
```

### 华为0731笔试题第二题
找匹配的数

```cpp
string s;
vector <string> a;
vector<int> result;
int num;
cin >> num;
cin.ignore();
while (num--)
{
    getline(cin, s);
    a.push_back(s);
}

for (int i = 0;i < a.size();i+=2)
{
    a[i] += a[i];
}

for (int i = 0;i < a.size();i += 2)
{
    if (a[i].find(a[i + 1])!=string::npos)
        result.push_back(1);
    else
        result.push_back(0);
}

for (int i = 0;i < result.size();i++)
    cout << result[i];
```

### 华为0731笔试题第一题
最接近某个数的商

```cpp
double num = 3.14159265358979;
double diff=0.5,difference;
int n, m;
int flag = 0;
double result;
int a = floor(num);
int b = ceil(num);

for (int i=0;i <= 10000 && flag==0;i++)
{
    for (int j = i*a;j <=i*b;j++)
    {
        result = abs((double)j / i - num);
        if (result == 0)
        {
            cout << j << " " << i;
            flag = 1;
            break;
        }
        else if (diff > result)
        {
            diff = result;
            m = j;
            n = i;
        }
    }
}
if(flag==0)
    cout << m << " " << n;
```

### 华为0808笔试（与或非计算）

```cpp
#include <cstdio>
#include <iostream>
#include <cstring>
#include <cmath>
#include <string>
#include <algorithm>
#include <queue>
#include <stack>
using namespace std;

const int MAXN = 150;
char s[MAXN];
char opset[6] = { '!','&','|','(',')','#' };
char prio[6][6] =
{
    '>', '>', '>', '<', '>', '>',
    '<', '>', '>', '<', '>', '>',
    '<', '<', '>', '<', '>', '>',
    '<', '<', '<', '<', '=', '>',
    '>', '>', '>', '<', '>', '>',
    '<', '<', '<', '<', '>', '=',
};

//找到对应运算符在 opset 数组的下标
int findindex(char op)
{
    for (int i = 0; i < 6; i++)
    {
        if (opset[i] == op)
            return i;
    }
}

char compare(char a, char b)
{
    int x = findindex(a);
    int y = findindex(b);
    return prio[x][y];
}

// 计算结果
int calc(int x, int y, char op)
{
    if (op == '|')
        return x | y;
    if (op == '&')
        return x & y;
    return 0;
}

int main()
{
    while (cin.get(s, MAXN))
    {
        int lens = strlen(s);
        s[lens] = '#';   // s 数组尾部存为'#'
        s[lens + 1] = '\0';
        int t, x, y;
        char op;
        int i = 0;
        stack<int>P;  // 用于存储运算数，整数元素
        stack<char>Q;  //用于存储运算符号，字符元素
        Q.push('#');  //把栈底存为 '#'
        while (s[i] != '#' || Q.top() != '#')
        {//当s数组读到末尾，且Q已经读到栈底，说明全部运算结束
            if (s[i] == '1' || s[i] == '0')
            {
                if (s[i] == '1')
                    t = 1;
                else
                    t = 0;
                P.push(t);
                i++;
            }
            else if (s[i] != ' ')
            {
                //由于输入的字符串包含空格，所以要空格要略过
                switch (compare(Q.top(), s[i]))
                {
                case '<':  // 栈顶元素优先级低，则当前元素入栈
                    Q.push(s[i]);
                    i++;
                    break;
                case '=': // 左右括号匹配，脱括号并接收下一字符
                    Q.pop();
                    i++;
                    break;
                case '>':  // 退栈并将运算结果入栈
                    if (Q.top() == '!')
                    {   // 栈顶元素为 ！，单目操作符
                        x = P.top();
                        P.pop();
                        P.push(!x);
                        Q.pop();
                    }
                    else
                    {   // 栈顶元素不是 ！双目操作符
                        x = P.top();
                        P.pop();
                        y = P.top();
                        P.pop();

                        op = Q.top();
                        Q.pop();    //计算结果并入栈
                        P.push(calc(x, y, op));
                    }
                    break;
                }
            }
        }
        int ans = P.top();
        cout << ans << endl;
        system("pause");
    }
    return 0;
}
```

### 网易笔试第二题

```cpp
// 全排序的类
class full_order 
{
public:
    void permute(vector<int>nums, vector<vector<int>>& ans, int begin, int end) {
        if (begin > end) 
        {
            if (front_equal(nums, nums.size()))
            {
                ans.push_back(nums);
                return;
            }
        }
        else 
        {
            for (int i = begin; i <= end; i++) 
            {
                swap(nums[begin], nums[i]);
                permute(nums, ans, begin + 1, end);
            }
        }
    }

    vector<vector<int>> permute(vector<int>& nums) 
    {
        vector<vector<int>> ans;
        int len = nums.size() - 1;
        permute(nums, ans, 0, len);
        return ans;
    }
    bool front_equal(vector<int> a, int num)
    {
        // 首尾两个数判断
        if (a.front() >= a.back() + a[2])
            return false;
        if (a.back() >= a.front() + a[num - 2])
            return false;

        // 中间的数判断
        for (int i = 1;i < (num - 1);i++)
        {
            if (a[i] >= a[i - 1] + a[i + 1])
                return false;
        }
        return true;
    }
};

// 输入过程
int num1, num2;
int j;
cin >> num1 >> num2;
if (num2 < 3)
    return 0;
vector<vector<int>> a(num1, vector<int>(num2, 0));
vector<vector<int>> b;
for (int i = 0;i < num1;i++)
{
    for (int j = 0;j < num2;j++)
    {
        cin >> a[i][j];
    }
}
    
// 得出全排序
full_order equal_before;
for (int i = 0;i < num1;i++)
{
    b = equal_before.permute(a[i]);
    if(b.size()!=0)
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
}
```

### BinaryTree-Travel

#### 遍历

```cpp
void preorderTraversalNew(TreeNode *root, vector<int> &path)
{
    stack< pair<TreeNode *, bool> > s;
    s.push(make_pair(root, false));
    bool visited;
    while(!s.empty())
    {
        root = s.top().first;
        visited = s.top().second;
        s.pop();
        if(root == NULL)
            continue;
        if(visited)
        {
            path.push_back(root->val);
        }
        else
        {
            s.push(make_pair(root->right, false));
            s.push(make_pair(root->left, false));
            s.push(make_pair(root, true));
        }
    }
}
```

>将else中的三行代码交换顺序，就可以实现二叉树的不同遍历方式

#### 前序遍历简化版本

```cpp
void preorderTraversalNew(TreeNode *root, vector<int> &path)
{
    stack<TreeNode *> s;
    s.push(root);
    while(!s.empty())
    {
        root = s.top();
        s.pop();
        if(root == NULL)
        {
            continue;
        }
        else
        {
            path.push_back(root->val);
            s.push(root->right);
            s.push(root->left);
        }
    }
}
```