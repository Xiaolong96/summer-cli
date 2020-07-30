import path from "path";
import chalk from "chalk";
import { isExistFolder, updateJsonFile } from "./utils/util";
import * as logger from "./utils/logger";
import inquirer from "inquirer";
import templates from "./config/templates";
import generator from "./utils/generator";
import { loadCmd } from "./utils/util.js";

/**
 * Initial project creation
 *
 * @param {*} projectName
 */
const init = projectName => {
  // If the file name does not exist, continue execution, otherwise exit
  isExistFolder(projectName).then(async () => {
    const answers = await inquire();

    try {
      console.log();
      console.log(
        `Creating a new project in ${chalk.cyan(path.resolve("./") + "/" + projectName)}.`
      );
      console.log();
      await generator(answers.template, path.resolve(projectName));

      console.log("Initialized a git repository.");

      await loadCmd(`git init ${projectName}`, "git init");

      console.log();
      console.log("Installing packages. This might take a couple of minutes.");

      await loadCmd(`npm install --prefix ./${projectName}`, "npm install");

      const fileName = `${projectName}/package.json`;
      answers.name = projectName;
      await updateJsonFile(fileName, answers);
      console.log();
      logger.info("package.json update completed.");
      console.log();

      await createdTips(projectName);
    } catch (error) {
      console.log();
      logger.error("Project initialization failed.");
      console.log(error);
    }
  });
};

/**
 * inquire
 *
 * @returns {*} answers
 */
async function inquire() {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Which template you want to create?",
      choices: formatTemplatesList(templates),
      filter(answer) {
        return /\S*/.exec(answer)[0];
      }
    },
    {
      type: "input",
      name: "description",
      message: "Please enter the project description: "
    },
    {
      type: "input",
      name: "author",
      message: "Please enter the author name: "
    }
  ]);

  return answers;
}

/**
 * 在 template.name 增加 right-pad，为了令右边的描述文字对齐。
 *
 * @returns {string[]} 整理完毕的字符串数组
 */
function formatTemplatesList(templates) {
  const newArr = [];
  let maxLength = 0;

  templates.forEach(item => {
    if (item.name.length > maxLength) {
      maxLength = item.name.length;
    }
  });

  templates.forEach(item => {
    newArr.push(`${item.name.padEnd(maxLength)}    ${item.desc}`);
  });

  return newArr;
}

/**
 * Log some help information after create template success.
 *
 * @param {*} target Target path
 */
async function createdTips(target) {
  logger.success("✨", "Project initialization finished!");
  console.log();
  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(` ${chalk.cyan("cd")} ${target}`);
  console.log(` ${chalk.cyan("npm start")}`);
  console.log();
  console.log("Happy hacking!");
}

export default init;
