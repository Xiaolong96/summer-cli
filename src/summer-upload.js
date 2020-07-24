import ora from "ora";
import * as logger from "./utils/logger";
import logSymbols from "log-symbols";
import inquirer from "inquirer";
const util = require("util");
const exec = util.promisify(require("child_process").exec);
import { updateJsonFile } from "./utils/util.js";

const debug = require("debug")("upload");

/**
 * upload
 *
 * @param {*} username
 * @param {*} token
 */
const upload = async (username, token) => {
  try {
    if (!username && !token) {
      const answers = await inquire("3");
      username = answers.username;
      token = answers.token;
    }
    if (!username) {
      const answers = await inquire("1");
      username = answers.username;
    }
    if (!token) {
      const answers = await inquire("2");
      token = answers.token;
    }

    debug("username: %s" + username);
    debug("token: %s" + token);

    await loadCmd(`git init`, "git init");

    if (!username || !token) {
      logger.warn("Cannot create remote repository without input parameters.");
    } else {
      const projectName = process
        .cwd()
        .split("/")
        .slice(-1)[0];
      const createInfo = await loadCmd(
        `curl -u "${username}:${token}" https://api.github.com/user/repos -d '{"name": "${projectName}"}'`,
        "Github repository creation"
      );
      logger.info("Github repository creation information: ");
      console.log(createInfo);
      await loadCmd(
        `git remote add origin https://github.com/${username}/${projectName}.git`,
        "Associate remote repository"
      );
      let spinner = ora();
      spinner.start(`package.json update repository...`);
      await updateJsonFile("package.json", {
        repository: {
          type: "git",
          url: `https://github.com/${username}/${projectName}.git`
        }
      }).then(() => {
        spinner.succeed("package.json update repository: command execution completed.");
      });
      await loadCmd(`git add .`, "git add");
      await loadCmd(`git commit -a -m 'Initialize the project'`, "git commit");
      // https 方式上传需要输入用户名，密码鉴权
      await exec("git push --set-upstream origin master");
      console.log(logSymbols.success, "git push: Command execution completed.");
      // const pushInfo = await loadCmd(`git push --set-upstream origin master`, "git push");
      // logger.info("git push information: ");
      // console.log(pushInfo);
    }
    await loadCmd(`npm install`, "npm install");
  } catch (err) {
    console.log();
    logger.error("Failed to create remote repository.");
    console.log(err);
    process.exit(1);
  }
};

/**
 *
 *
 * @param {string} type
 * @returns
 */
async function inquire(type) {
  const allQuestion = [
    {
      type: "input",
      name: "username",
      message: "Please enter the github username: "
    },
    {
      type: "input",
      name: "token",
      message: "Please enter the github token: "
    }
  ];
  let question;
  switch (type) {
    case "1":
      question = allQuestion.slice(0, 1);
      break;
    case "2":
      question = allQuestion.slice(1, 2);
      break;
    case "3":
      question = allQuestion;
      break;
    default:
      question = allQuestion;
      break;
  }
  debug("question: %o", question);
  const answers = await inquirer.prompt(question);

  return answers;
}

/**
 * Excuting an command
 *
 * @param {*} cmd
 * @param {*} text
 */
let loadCmd = async (cmd, text) => {
  let loading = ora();
  loading.start(`${text}: Command is executing...`);
  const res = await exec(cmd);
  loading.succeed(`${text}: Command execution completed.`);
  return res;
};

export default upload;
