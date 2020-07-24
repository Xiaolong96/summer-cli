import fs from "fs";
import * as logger from "./logger";

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

export { isExistFolder, updateJsonFile };
