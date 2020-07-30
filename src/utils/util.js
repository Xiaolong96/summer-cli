import fs from "fs";
import * as logger from "./logger";
import ora from "ora";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

/**
 * Determine whether the folder exists
 *
 * @param {*} name
 * @returns
 */
let isExistFolder = async name => {
  return new Promise(resolve => {
    if (fs.existsSync(name)) {
      logger.error("Project folder already exists.");
    } else {
      resolve();
    }
  });
};

/**
 * update package.json
 *
 * @param {*} fileName
 * @param {*} obj
 * @returns
 */
let updateJsonFile = (fileName, obj) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName).toString();
      let json = JSON.parse(data);
      Object.keys(obj).forEach(key => {
        json[key] = obj[key];
      });
      fs.writeFileSync(fileName, JSON.stringify(json, null, "\t"), "utf-8");
      resolve();
    } else {
      reject("package.json does not exist！");
    }
  });
};

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

export { isExistFolder, updateJsonFile, loadCmd };
