"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var logger = _interopRequireWildcard(require("./utils/logger"));

var _logSymbols = _interopRequireDefault(require("log-symbols"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _ora = _interopRequireDefault(require("ora"));

var _util = require("./utils/util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const util = require("util");

const exec = util.promisify(require("child_process").exec);

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
    debug("token: %s" + token); // await loadCmd(`git init`, "git init");

    if (!username || !token) {
      logger.warn("Cannot create remote repository without input parameters.");
    } else {
      const projectName = process.cwd().split("/").slice(-1)[0];
      const createInfo = await (0, _util.loadCmd)(`curl -u "${username}:${token}" https://api.github.com/user/repos -d '{"name": "${projectName}"}'`, "Github repository creation");
      logger.info("Github repository creation information: ");
      console.log(createInfo);
      await (0, _util.loadCmd)(`git remote add origin https://github.com/${username}/${projectName}.git`, "Associate remote repository");
      let spinner = (0, _ora.default)();
      spinner.start(`package.json update repository...`);
      await (0, _util.updateJsonFile)("package.json", {
        repository: {
          type: "git",
          url: `https://github.com/${username}/${projectName}.git`
        }
      }).then(() => {
        spinner.succeed("package.json update repository: command execution completed.");
      });
      await (0, _util.loadCmd)(`git add .`, "git add");
      await (0, _util.loadCmd)(`git commit -a -m 'Initialize the project'`, "git commit"); // https 方式上传需要输入用户名，密码鉴权

      await exec("git push --set-upstream origin master");
      console.log(_logSymbols.default.success, "git push: Command execution completed."); // const pushInfo = await loadCmd(`git push --set-upstream origin master`, "git push");
      // logger.info("git push information: ");
      // console.log(pushInfo);
    } // await loadCmd(`npm install`, "npm install");

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
  const allQuestion = [{
    type: "input",
    name: "username",
    message: "Please enter the github username: "
  }, {
    type: "input",
    name: "token",
    message: "Please enter the github token: "
  }];
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
  const answers = await _inquirer.default.prompt(question);
  return answers;
}

var _default = upload;
exports.default = _default;