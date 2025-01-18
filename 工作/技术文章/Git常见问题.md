### 紧急任务需要切换分支

- [Git-开发中遇到紧急任务处理流程](https://www.cnblogs.com/fanfan-90/p/12684357.html)
- [Git 分支切换 暂时保存到现在的分支（不进行add），切换到其他分支改东西](https://blog.csdn.net/ouxiaoxian/article/details/103312917)

### git rm 取消对文件的追踪

```
//取消对所有文件的追踪
git rm -r --cached        //不删除本地文件
git rm -r --f             //删除本地文件

// 对某个文件取消追踪
git rm --cached idea.txt   //删除idea.txt跟踪，并保留本地
git rm --f idea.txt        //删除idea.txt耿总，并且删除本地文件
```

### git cherry-pick

对于多分支的代码库，将代码从一个分支转移到另一个分支是常见需求。

这时分两种情况。一种情况是，你需要另一个分支的所有代码变动，那么就采用合并（git merge）。另一种情况是，你只需要部分代码变动（某几个提交），这时可以采用 Cherry pick。

[http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html](http://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html)

### git reset 单个文件回滚到指定版本

[https://www.jianshu.com/p/551741eb1735](https://www.jianshu.com/p/551741eb1735)

### 我的提交信息(commit message)写错了

如果你的提交信息(commit message)写错了且这次提交(commit)还没有推(push), 你可以通过下面的方法来修改提交信息(commit message):

```
$ git commit –amend –only
```

这会打开你的默认编辑器, 在这里你可以编辑信息. 另一方面, 你也可以用一条命令一次完成:

```
$ git commit –amend –only -m ‘xxxxxxx’
```

如果你已经推(push)了这次提交(commit), 你可以修改这次提交(commit)然后强推(force push), 但是不推荐这么做。