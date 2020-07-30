"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.success = exports.info = exports.warn = exports.error = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _logSymbols = _interopRequireDefault(require("log-symbols"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const error = (...str) => {
  console.log(`${_chalk.default.red("error")} ${str.join(" ")} ${_logSymbols.default.error}`);
};

exports.error = error;

const warn = (...str) => {
  console.log(`${_chalk.default.yellow("warning")} ${str.join(" ")} ${_logSymbols.default.warning}`);
};

exports.warn = warn;

const info = (...str) => {
  console.log(`${_chalk.default.blue("info")} ${str.join(" ")} ${_logSymbols.default.info}`);
};

exports.info = info;

const success = (...str) => {
  console.log(`${_chalk.default.green("success")} ${str.join(" ")} ${_logSymbols.default.success}`);
};

exports.success = success;