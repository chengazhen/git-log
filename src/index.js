#!/usr/bin/env node

import { exec, execSync } from "child_process";
import { promises as fs } from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateDailyReport } from "./fetch.js";
import ConfigManager from "./config.js";

const OUTPUT_FILE = "git_commits.txt";
const OUTPUT_MD_FILE = "git_commits.md";

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
  outputFile = OUTPUT_FILE
) {
  if (!isGitRepository(process.cwd())) {
    console.error("错误: 当前目录不是一个git仓库");
    return;
  }

  const author = ConfigManager.getAuthor();
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
    console.log("开始生成日报...");
    const report = await generateDailyReport(stdout);
    await fs.writeFile(OUTPUT_MD_FILE, report, "utf-8");
    console.log(`日报已保存到 ${OUTPUT_MD_FILE}`);
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

      getGitCommits(timeFilter, argv.output);
    }
  )
  .command("config", "配置管理", (yargs) => {
    return yargs
      .command(
        "list",
        "查看当前配置",
        () => {},
        () => {
          const author = ConfigManager.getAuthor();
          const apiUrl = ConfigManager.getApiUrl();
          const apiKey = ConfigManager.getApiKey();
          
          console.log("\n当前配置信息：");
          console.log("----------------------------------------");
          console.log(`作者名称: ${author || '未设置'}`);
          console.log(`API 地址: ${apiUrl || '未设置'}`);
          console.log(`API Key: ${apiKey ? '已设置' : '未设置'}`);
          console.log("----------------------------------------\n");
        }
      )
      .command(
        "set-author <author>",
        "设置作者名称",
        (yargs) => {
          return yargs.positional("author", {
            describe: "作者名称",
            type: "string",
            demandOption: true
          });
        },
        (argv) => {
          ConfigManager.saveAuthor(argv.author);
        }
      )
      .command(
        "set-api-url <url>",
        "设置 AI API 地址",
        (yargs) => {
          return yargs.positional("url", {
            describe: "API 地址，例如：https://api.openai.com/v1/chat/completions",
            type: "string",
            demandOption: true
          });
        },
        (argv) => {
          ConfigManager.saveApiUrl(argv.url);
        }
      )
      .command(
        "set-api-key <key>",
        "设置 AI API Key",
        (yargs) => {
          return yargs.positional("key", {
            describe: "API Key，格式如：sk-xxxxxxxxxxxxxxxxxxxxxxxx",
            type: "string",
            demandOption: true
          });
        },
        (argv) => {
          ConfigManager.saveApiKey(argv.key);
        }
      )
      .demandCommand(1, "请指定要执行的配置命令")
      .example("$0 config list", "查看当前配置")
      .example("$0 config set-author 'John Doe'", "设置作者名称")
      .example("$0 config set-api-url 'https://api.example.com/v1/chat/completions'", "设置 AI API 地址")
      .example("$0 config set-api-key 'sk-xxxxxx'", "设置 AI API Key");
  })
  .example("$0 -d 7", "获取最近7天的提交记录")
  .example("$0 -t", "获取当天提交记录")
  .example('$0 -o "output.txt"', "指定输出文件名")
  .help()
  .alias("h", "help")
  .alias("v", "version").argv;

