# git-log

一个简单的命令行工具，用于获取 Git 仓库的提交记录并生成钉钉日报。

## 安装

```bash
npm i @azhena/git-log -g 
```

## 使用方法

### 基本命令

```bash
git-log [选项]
```

### 命令行选项

* `-t, --today`：获取当天提交记录
* `-d, --days <number>`：要查询的天数（默认：7天）
* `-o, --output <string>`：输出文件名（默认：git_commits.txt）
* `--help`：显示帮助信息

### 配置管理

使用 `git-log config` 命令管理配置：

```bash
# 查看当前配置
git-log config list

# 设置作者名称
git-log config set-author "yourname"

# 设置 AI API 地址
git-log config set-api-url "https://api.example.com/v1/chat/completions"

# 设置 AI API Key
git-log config set-api-key "your-api-key"
```

### 示例

获取当天提交记录并生成日报：

```bash
git-log -t
```

获取最近 7 天的提交记录：

```bash
git-log
```

获取最近 30 天的提交记录：

```bash
git-log -d 30
```

将提交记录保存到指定文件：

```bash
git-log -o "my_commits.txt"
```

### 输出文件

工具会生成两个文件：
* `git_commits.txt`：原始的 Git 提交记录
* `git_commits.md`：基于提交记录生成的钉钉日报（Markdown 格式）

## 功能特点

* 支持自定义查询时间范围
* 支持按作者筛选提交记录
* 自动过滤合并提交
* 格式化的提交时间输出
* 自动生成钉钉日报
* 完整的配置管理功能

## 注意事项

* 必须在 Git 仓库目录下运行
* 首次使用前需要配置作者名称和 AI API 信息
* 提交记录输出格式：`日期时间 | 提交信息`
* 日报输出采用 Markdown 格式，包含工作内容、问题及解决方案、工作计划等板块

## 许可证

MIT
