1. 目的：更好的实现代码管理 source control system
2. 实现途径：免费，C语言开发
3. 集中式和分布式

集中式工作必须联网  
安全性高，可添加中央服务器交换（github）  
git里面用insert进行复制粘贴操作  
到指定目录：cd e/git/

**更新** **git** **版本**  
git update-git-for-windows
 
git里面用insert进行复制粘贴操作  
到指定目录：cd e/git/  
Git init 初始化git目录  
Git add 将文件加入控制目录  
Git commit -m''mark' 给修改添加标签
 
Git status gi 查看状态  
Git diff 查看修改差异  
Git rest ^退回到之前版本  
Git log 查看版本号  
Git reflog 查看过往操作代号  
Git checkout --file 返回最近版本  
Git reset HEAD<file> 返回至最近版本(已经执行 git add)  
Rm 删除 git commit 提交删除
 
连接网络端与本地  
git remote add origin git@github.com:PattonMT/learngit
 
//git pull --rebase origin master  
把本地库的所有内容推送到远程仓库  
git push -u origin master  
下一次继续往该仓库推送文件则可以省略-u命令  
git push origin master
   

git clone + 自己Git库的地址
 
git checkout -b dev 创建新的分支

鼓励使用大量分支  
$ git checkout -b dev
 
查看分支：git branch
 
创建分支：git branch <name>
 
切换分支：git checkout <name>
 
创建+切换分支：git checkout -b <name>
 
合并某分支到当前分支：git merge <name>
 
删除分支：git branch -d <name>  
若出现冲突，进入文档直接修改
 
Git stash /git stash pop 中断存储，去修复别的bug
 
Git tag 与 commit 相绑定，版本号
 
Git remote -v 用来查看远程的仓库信息
 
Git 命令清单  
[http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)