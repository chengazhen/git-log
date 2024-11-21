#!/usr/bin/env node

import { exec, execSync } from "child_process";
import { promises as fs } from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const OUTPUT_FILE = "git_commits.txt";

function isGitRepository(path) {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      cwd: path,
      stdio: "ignore",
    });
    return true;
  } catch (e) {
    return false;
  }
}

async function getGitCommits(
  timeFilter,
  author = "chengchongzhen",
  outputFile = OUTPUT_FILE
) {
  if (!isGitRepository(process.cwd())) {
    console.error("错误: 当前目录不是一个git仓库");
    return;
  }

  const cmd = `git log \
        ${timeFilter} \
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

    await fs.writeFile(outputFile, stdout, "utf-8");
    console.log(`提交记录已保存到 ${outputFile}`);
  } catch (error) {
    console.error("发生错误:", error);
  }
}

yargs(hideBin(process.argv))
  .command(
    "*",
    "获取git提交记录",
    (yargs) => {
      return yargs
        .option("days", {
          alias: "d",
          type: "number",
          description: "最近几天的提交",
          conflicts: ["day"],
        })
        .option("today", {
          alias: "t",
          type: "string",
          description: "具体日期 (YYYY-MM-DD)",
          conflicts: ["days"],
        })
        .option("author", {
          alias: "a",
          type: "string",
          description: "作者名称",
          default: "chengchongzhen",
        })
        .option("output", {
          alias: "o",
          type: "string",
          description: "输出文件名",
          default: OUTPUT_FILE,
        });
    },
    (argv) => {
      let timeFilter = `--since="7 days ago"`;
      // 判断是否执行了days参数，可以为空
      if (typeof argv.days !== "undefined") {
        timeFilter = `--since="${argv.days} days ago"`;
      }

      if (typeof argv.today !== "undefined") {
        timeFilter = `--since="today.midnight"`;
      }

      console.log(timeFilter);
      getGitCommits(timeFilter, argv.author, argv.output);
    }
  )
  .example("$0 -d 7", "获取最近7天的提交记录")
  .example("$0 -t", "获取当天提交记录")
  .example('$0 -a "作者名称"', "获取指定作者的提交记录")
  .example('$0 -o "output.txt"', "指定输出文件名")
  .help()
  .alias("h", "help")
  .alias("v", "version").argv;
