"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _chalk = _interopRequireDefault(require("chalk"));

var logger = _interopRequireWildcard(require("./utils/logger"));

var _ora = _interopRequireDefault(require("ora"));

var _checkVersion = require("./utils/check-version");

var _summerInit = _interopRequireDefault(require("./summer-init"));

var _summerUpload = _interopRequireDefault(require("./summer-upload"));

var _summerCache = _interopRequireDefault(require("./summer-cache"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async () => {
  // check version
  const spinner = (0, _ora.default)();
  spinner.start("> check version ... "); // checkVersion(pkg) 返回 {hasNewer:Boolean, remoteVersion, localVersion}

  const versionInfo = await (0, _checkVersion.checkVersion)("summer-cli");
  spinner.stop(); // If the latest version is available, prompt the user

  if (versionInfo.hasNewer) {
    console.log();
    logger.warn(`  A newer version of ${_chalk.default.magenta("summer-cli")} is available.`);
    console.log(`  latest:       ${_chalk.default.green(versionInfo.remoteVersion)}`);
    console.log(`  installed:    ${_chalk.default.green(versionInfo.localVersion)}`);
    console.log(`  Please upgrade via the command line: ${_chalk.default.green("npm i -g summer-cli")}`);
    console.log();
  } else {// logger.success(`The current version is the latest@${versionInfo.localVersion}`);
    // console.log();
  }
  /**
   * summer-cli command list
   */


  _commander.default.command("init <project>").description("Create a new project 🌶").alias("i").usage("<project-name> 🌶").action(project => {
    (0, _summerInit.default)(project);
  });

  _commander.default.command("upload").description("Create remote repository, associate the project and upload to Github 🌶").alias("up").usage("-u, --username [username] -t, --token [token] 🌶").option("-u, --username [username]", "Github username").option("-t, --token [token]", "Access token created by Github").action(cmdObj => {
    (0, _summerUpload.default)(cmdObj.username, cmdObj.token);
  });

  _commander.default.command("cache").description("View or delete cache files 🌶").alias("c").usage("-d, --delete -i, --info 🌶").option("-d, --delete", "Delete cache").option("-i, --info", "Show cache information").action(cmdObj => {
    (0, _summerCache.default)(cmdObj.delete, cmdObj.info);
  }); // Project version


  _commander.default.version(require("../package.json").version, "-v, --version", "Print version information and quit").parse(process.argv);
  /**
   * When there is no parameter after the summer-cli command, the help information is output
   */


  if (!process.argv.slice(2).length) {
    _commander.default.outputHelp();

    process.exit(0);
  }
})();