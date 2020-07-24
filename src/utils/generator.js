import { TEMPLATES_CACHE_DIR } from "../config/path";
import fs from "fs-extra";
import path from "path";
import downloadGit from "download-git-repo";
import ora from "ora";
import templates from "../config/templates";
import * as logger from "../utils/logger";

const debug = require("debug")("generator");

/**
 * 生成初始化项目
 *
 * @param {*} template 模版名称
 * @param {*} dest 生成目录地址
 */
async function generator(template, dest) {
  // 确保模版缓存目录存在，不存在则创建
  fs.ensureDirSync(TEMPLATES_CACHE_DIR, err => {
    console.log(err);
  });

  const templatePath = path.resolve(TEMPLATES_CACHE_DIR, template);

  debug("templatePath %s", templatePath);
  debug("dest: %s", dest);

  const spinner = ora("Downloading template...");
  spinner.start();

  if (fs.existsSync(templatePath)) {
    await fs.copy(templatePath, dest);
    spinner.stop();
  } else {
    try {
      await downloadTemplate(
        `direct:${templates.filter(_t => _t.name === template)[0].repo}`,
        templatePath
      );
      await fs.copy(templatePath, dest);
      spinner.stop();
    } catch (error) {
      spinner.stop();
      console.log();
      logger.error("Template download failed.");
      console.log(error);
    }
  }
}

/**
 * Download template from remote
 *
 * @param {*} repo
 * @param {*} dest
 * @returns
 */
async function downloadTemplate(repo, dest) {
  return new Promise((resolve, reject) => {
    downloadGit(repo, dest, { clone: true }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default generator;
