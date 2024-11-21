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

async function getGitCommits(days = 7, author = 'chengchongzhen', outputFile = 'git_commits_today.txt') {
    if (!isGitRepository(process.cwd())) {
        console.error('错误: 当前目录不是一个git仓库');
        return;
    }

    const cmd = `git log \
        --since="${days} days ago" \
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

// 由于yargs在ESM中的使用方式略有不同
const argv = yargs(hideBin(process.argv))
    .option('days', {
        alias: 'd',
        type: 'number',
        description: '要查询的天数',
        default: 7
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

getGitCommits(argv.days, argv.author, argv.output);