"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _util = require("./utils/util");

var logger = _interopRequireWildcard(require("./utils/logger"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _templates = _interopRequireDefault(require("./config/templates"));

var _generator = _interopRequireDefault(require("./utils/generator"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Initial project creation
 *
 * @param {*} projectName
 */
const init = projectName => {
  // If the file name does not exist, continue execution, otherwise exit
  (0, _util.isExistFolder)(projectName).then(async () => {
    const answers = await inquire();

    try {
      await (0, _generator.default)(answers.template, _path.default.resolve(projectName));
      const fileName = `${projectName}/package.json`;
      answers.name = projectName;
      await (0, _util.updateJsonFile)(fileName, answers);
      console.log();
      logger.info("#", "package.json update completed.");
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
  const answers = await _inquirer.default.prompt([{
    type: "list",
    name: "template",
    message: "Which template you want to create?",
    choices: formatTemplatesList(_templates.default),

    filter(answer) {
      return /\S*/.exec(answer)[0];
    }

  }, {
    type: "input",
    name: "description",
    message: "Please enter the project description: "
  }, {
    type: "input",
    name: "author",
    message: "Please enter the author name: "
  }]);
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
  logger.success("#", "Project initialization finished!🎉");
  console.log();
  console.log("To install packages:");
  console.log();
  logger.info(`cd ${target}`);
  logger.info("npm install (or if using yarn: yarn)");
}

var _default = init;
exports.default = _default;