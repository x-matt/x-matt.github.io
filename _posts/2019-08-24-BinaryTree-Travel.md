---
title: BinaryTree Travel
author: Sean Matt
date: 2019-08-24 11:33:00 +0800
categories: [C++, Basic]
tags: [c++]
math: true
mermaid: true
---
[参考](https://blog.csdn.net/czy47/article/details/81254984)

## 遍历

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

## 前序遍历简化版本

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