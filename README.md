# git-log

一个简单的命令行工具，用于获取 Git 仓库的提交记录。

## 安装

```bash
npm i @azhena/git-log -g 
```

## 使用方法

```bash
glog [选项]
```

### 命令行选项

* `-t, --today`：获取当天提交记录
* `-d, --days <number>`：要查询的天数（默认：7天）
* `-a, --author <string>`：作者名称（默认：chengchongzhen）
* `-o, --output <string>`：输出文件名（默认：git_commits_today.txt）
* `-u, --apiUrl <string>`：AI API 地址（默认：https://free.zeroai.chat/v1/chat/completions）
* `--help`：显示帮助信息

### 示例

设置 AI API 地址：

```bash
glog -u "https://api.example.com/v1/chat/completions"
```

获取当天提交记录：

```bash
glog -t
```

```
git_commits.md
---
**今日工作内容**  
+ 更新钉钉日报生成逻辑，优化格式并修改请求地址；删除无用的提交记录文件  
+ 添加日报生成功能，基于 Git 提交记录生成钉钉日报并保存为 Markdown 文件  
+ 更新 git-log 工具，重构逻辑并迁移至 index.js，支持更灵活的时间过滤选项  
+ 修改 git-log.js，支持通过日期范围查询提交记录  
+ 更新版本号至 1.0.4-beta  
+ 更新 .gitignore，忽略 dist 目录和 git_commits 文件  
+ 更新 README.md 文件，添加今日提交记录  

**遇到的问题与解决方案**  
+ 无

**明日工作计划**  
+ 继续优化钉钉日报生成逻辑  
+ 添加更多日期范围筛选选项，提高日报生成的灵活性  
+ 优化 README 文档，进一步完善使用说明  

---
git_commits.txt

# 2024-11-21 11:30:36 | fix: 修正安装命令的顺序
# 2024-11-21 11:26:37 | chore: 更新版本号至 1.0.3
# 2024-11-21 11:25:35 | chore: 更新版本号至 1.0.2，修改项目仓库地址
# 2024-11-21 11:18:23 | chore: 更新版本号至 1.0.1，添加项目仓库信息，删除 README.md 中的多余内容
# 2024-11-21 11:17:32 | fix: 修正安装命令和包名，更新为 @azhena/git-log
# 2024-11-21 10:40:55 | doc: 删除 README.md 文件中的无用描述
# 2024-11-21 10:37:34 | 添加 README.md 文件，描述 git-log 工具的安装、使用方法及功能特点
# 2024-11-21 10:05:50 | first commit
```

获取最近 7 天的提交记录：

```bash
glog

```

获取指定作者最近 30 天的提交记录：

```bash
glog -d 30 -a "yourname"
```

将提交记录保存到指定文件：

```bash
glog -o "my_commits.txt"
```

## 功能特点

* 支持自定义查询时间范围
* 支持按作者筛选提交记录
* 自动过滤合并提交
* 格式化的提交时间输出
* 将结果保存到指定文件

## 注意事项

* 必须在 Git 仓库目录下运行
* 输出格式：`日期时间 | 提交信息`

## 许可证

MIT
