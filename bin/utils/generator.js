"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("../config/path");

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path2 = _interopRequireDefault(require("path"));

var _downloadGitRepo = _interopRequireDefault(require("download-git-repo"));

var _ora = _interopRequireDefault(require("ora"));

var _templates = _interopRequireDefault(require("../config/templates"));

var logger = _interopRequireWildcard(require("../utils/logger"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require("debug")("generator");
/**
 * 生成初始化项目
 *
 * @param {*} template 模版名称
 * @param {*} dest 生成目录地址
 */


async function generator(template, dest) {
  // 确保模版缓存目录存在，不存在则创建
  _fsExtra.default.ensureDirSync(_path.TEMPLATES_CACHE_DIR, err => {
    console.log(err);
  });

  const templatePath = _path2.default.resolve(_path.TEMPLATES_CACHE_DIR, template);

  debug("templatePath %s", templatePath);
  debug("dest: %s", dest);
  const spinner = (0, _ora.default)("Downloading template...");
  spinner.start();

  if (_fsExtra.default.existsSync(templatePath)) {
    await _fsExtra.default.copy(templatePath, dest);
    spinner.stop();
  } else {
    try {
      await downloadTemplate(`direct:${_templates.default.filter(_t => _t.name === template)[0].repo}`, templatePath);
      await _fsExtra.default.copy(templatePath, dest);
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
    (0, _downloadGitRepo.default)(repo, dest, {
      clone: true
    }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

var _default = generator;
exports.default = _default;