
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

- `-d, --days <number>`：要查询的天数（默认：7天）
- `-a, --author <string>`：作者名称（默认：chengchongzhen）
- `-o, --output <string>`：输出文件名（默认：git_commits_today.txt）
- `--help`：显示帮助信息

### 示例

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

- 支持自定义查询时间范围
- 支持按作者筛选提交记录
- 自动过滤合并提交
- 格式化的提交时间输出
- 将结果保存到指定文件

## 注意事项

- 必须在 Git 仓库目录下运行
- 输出格式：`日期时间 | 提交信息`

## 许可证

MIT
