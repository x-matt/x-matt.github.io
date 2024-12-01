> [!INFO] 说明
> 该文档用于放置&总结项目中的一些文档和问题

| 项目代号 | 项目名称      | 项目平台 | 平台型号           | 相关文档     |
| ---- | --------- | ---- | -------------- | -------- |
| M12A | aristotle | mtk  | mt6895         | [[m12]]  |
| M12  | corot     | mtk  | mt6985(DX-2)   | [[m12]]  |
| N11A | duchamp   | mtk  | mt6897(DX-23P) | [[n11a]] |
| N12  | rocort    | mtk  | mt6989(DX-3)   | [[n12]]  |

### 算法库更新

- 连接方式-ip: 10.162.10.22
- 端口：22
- 协议：sftp
- 账号：xiaomi
- 密码：S8iD98MqZvRmrUAn5n8=

```bash
# 1. check 项目的算法库文件
sftp xiaomi@10.162.10.22
# 2. 填写密码
S8iD98MqZvRmrUAn5n8=
# 3. 到指定目录, 拉取出对应文件
## 获取单个文件
get file
## 获取整个文件夹
mget -r folder
```

### 快速编译

`./prebuilts/build-tools/linux-x86/bin/ninja -f out/combined-*.ninja  hal_images | tee fast_build.log`