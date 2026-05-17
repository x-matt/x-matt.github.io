---
tags:
  - tool
---

## Install feishu

1. 安装npm 包错误

```bash
$ npm install -g
npm error code EACCES
npm error syscall mkdir
npm error path /usr/lib/node_modules/@mi
npm error errno -13
npm error Error: EACCES: permission denied, mkdir '/usr/lib/node_modules/@mi'
npm error     at async mkdir (node:internal/fs/promises:855:10)
npm error     at async /usr/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/arborist/reify.js:624:20
npm error     at async Promise.allSettled (index 0)
npm error     at async [reifyPackages] (/usr/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/arborist/reify.js:325:11)
npm error     at async Arborist.reify (/usr/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/arborist/reify.js:142:5)
npm error     at async Install.exec (/usr/lib/node_modules/npm/lib/commands/install.js:150:5)
npm error     at async Npm.exec (/usr/lib/node_modules/npm/lib/npm.js:207:9)
npm error     at async module.exports (/usr/lib/node_modules/npm/lib/cli/entry.js:74:5) {
npm error   errno: -13,
npm error   code: 'EACCES',
npm error   syscall: 'mkdir',
npm error   path: '/usr/lib/node_modules/@mi'
npm error }
npm error
npm error The operation was rejected by your operating system.
npm error It is likely you do not have the permissions to access this file as the current user
npm error
npm error If you believe this might be a permissions issue, please double-check the
npm error permissions of the file and its containing directories, or try running
npm error the command again as root/Administrator.
npm error A complete log of this run can be found in: /home/docker/.npm/_logs/2026-04-08T06_53_20_265Z-debug-0.log
```

1. 改成用户级全局目录

```bash
npm config set prefix ~/.npm-global
echo 'export PATH=$HOME/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

npm install -g
```

1. 恢复

```bash
npm config delete prefix
vim ~/.bashrc  #删除刚刚添加的那一行
source ~/.bashrc
```
