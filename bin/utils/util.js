"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadCmd = exports.updateJsonFile = exports.isExistFolder = void 0;

var _fs = _interopRequireDefault(require("fs"));

var logger = _interopRequireWildcard(require("./logger"));

var _ora = _interopRequireDefault(require("ora"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    if (_fs.default.existsSync(name)) {
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


exports.isExistFolder = isExistFolder;

let updateJsonFile = (fileName, obj) => {
  return new Promise((resolve, reject) => {
    if (_fs.default.existsSync(fileName)) {
      const data = _fs.default.readFileSync(fileName).toString();

      let json = JSON.parse(data);
      Object.keys(obj).forEach(key => {
        json[key] = obj[key];
      });

      _fs.default.writeFileSync(fileName, JSON.stringify(json, null, "\t"), "utf-8");

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


exports.updateJsonFile = updateJsonFile;

let loadCmd = async (cmd, text) => {
  let loading = (0, _ora.default)();
  loading.start(`${text}: Command is executing...`);
  const res = await exec(cmd);
  loading.succeed(`${text}: Command execution completed.`);
  return res;
};

exports.loadCmd = loadCmd;