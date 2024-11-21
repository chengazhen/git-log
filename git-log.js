#!/usr/bin/env node

import { exec, execSync } from 'child_process';
import { promises as fs } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function isGitRepository(path) {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      cwd: path,
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function getGitCommits(
    days = null,
    startDate = null,
    endDate = null,
    author = 'chengchongzhen',
    outputFile = 'git_commits_today.txt'
) {
    if (!isGitRepository(process.cwd())) {
        console.error('错误: 当前目录不是一个git仓库');
        return;
    }

    let dateFilter = '';
    if (days !== null) {
        dateFilter = `--since="${days} days ago"`;
    } else if (startDate && endDate) {
        dateFilter = `--after="${startDate}" --before="${endDate}"`;
    } else if (startDate) {
        dateFilter = `--after="${startDate}"`;
    } else if (endDate) {
        dateFilter = `--before="${endDate}"`;
    }

    const cmd = `git log \
        ${dateFilter} \
        --author=${author} \
        --pretty=format:"%ad | %s" \
        --date=format:"%Y-%m-%d %H:%M:%S" \
        --all \
        --no-merges`;

    try {
        const { stdout, stderr } = await new Promise((resolve, reject) => {
            exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
                if (error) reject(error);
                resolve({ stdout, stderr });
            });
        });

        await fs.writeFile(outputFile, stdout, 'utf-8');
        console.log(`提交记录已保存到 ${outputFile}`);

    } catch (error) {
        console.error('发生错误:', error);
    }
}

// 修改命令行参数配置
const argv = yargs(hideBin(process.argv))
    .option('days', {
        alias: 'd',
        type: 'number',
        description: '要查询的天数',
        default: null
    })
    .option('start-date', {
        alias: 's',
        type: 'string',
        description: '开始日期 (YYYY-MM-DD)',
    })
    .option('end-date', {
        alias: 'e',
        type: 'string',
        description: '结束日期 (YYYY-MM-DD)',
    })
    .option('author', {
        alias: 'a',
        type: 'string',
        description: '作者名称',
        default: 'chengchongzhen'
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: '输出文件名',
        default: 'git_commits_today.txt'
    })
    .help()
    .parse();

getGitCommits(argv.days, argv['start-date'], argv['end-date'], argv.author, argv.output);