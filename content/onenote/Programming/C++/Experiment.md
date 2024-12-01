# Experiment 1-HeapSort

设计思路：  
建立大顶堆：利用插入，顺次将数插入  
删除最大节点-a[0]，将其放在最后面，剩下的数继续按照大顶堆的规则上移   `#include <iostream>`
using namespace std;
 
/*用引用传参的方法定义一个swap函数*/  
template <typename T>  
void swap1(T &a,T &b)  
{  
T tmp;  
ttmp=a;  
a=b;  
b=tmp;  
}
 
template <typename T>  
void insert_iti(T a[], int length)  
{  
while (length>0)  
{  
int parent=(length-1)/2;
 
if (a[parent]<a[length])  
{  
swap1(a[parent],a[length]);  
length=parent;  
}  
else  
break;  
}  
}
 
template <typename T>  
void delete_min(T a[], int length)  
{  
T tmp=a[0];  
int ind=0;
 
while(1)  
{  
int left = 2*ind + 1;  
int right = 2*ind + 2;
 
if(left>=length)  
{  
break;  
}  
else  
{  
int large=a[left]>a[right] ? left : right;  
a[ind]=a[large];  
ind=large;  
}  
}
 
a[ind]=a[length];  
insert_i(a,index);  
a[length]=tmp;  
}
   

/*堆排序*/  
template <typename T>  
void heapSort(T a[],int n)  
{  
// 构建大根堆（从最后一个非叶子节点向上）  
for (int i=0;i<n;i++)  
{  
insert_i(a,i);  
}
 
cout<<"0 : ";  
for(int k=0;k<n;k++)  
cout<<a[k]<<" ";  
cout<<endl;
 
for (int i=n-1;i>0;i--)  
{  
delete_min(a,i);
 
cout<<n-i<<" : ";  
for (int k=0;k<n;k++)  
cout<<a[k]<<" ";  
cout<<endl;  
}  
}
 
int main()  
{  
int n=0;
 
cout<<"排序数据个数：";  
cin>>n;  
double *a=new double[n];
 
cout<<"输入排序数据：";  
for(int i=0;i<n;i++)  
{  
cin>>a[i];  
}
 
heapSort(a,n);
 
cout<<endl<<"排序结果：";  
for(int i=0;i<n;i++)  
cout<<a[i]<<" ";  
return 0;  
}

# Experiment 2- Matrix4×4

难点：重载输入输出流"<<"">>"  
istream & operator >> (istream & input ,自定义类 &) ==input====是== ==cin====的别名==  
&-引用的使用可以提高运行效率，const 类型名 & 可以保证使用的同时保证数据安全  
双目运算符重载为友元函数；单目运算符重载为成员函数  
转换构造函数：将某个参数转化为类的对象，转换构造函数只能有一个参数。  
数组与指针的仅有的区别就是数组是常指针，不能被赋值给其他对象

# Experiment 3-Vector

&申请动态空间  
T* buf;  
buf=new T[size];  
delete [] buf;  
buf=NULL;

# Visual studio显示程序运行时间

`#include <time.h>  `
clock_t start, finish;  
double totaltime;  
start = clock();
 
finish = clock();  
totaltime = (double)(finish - start) / CLOCKS_PER_SEC;  
cout << "此程序的运行时间为" << totaltime << "秒" << endl;