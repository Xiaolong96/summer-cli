"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = require("./config/path");

var logger = _interopRequireWildcard(require("./utils/logger"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = (d, i) => {
  if (i) {
    console.log("Templates and version information cache directory: ");
    logger.info(_path.CACHE_DIR);
  }

  if (d) {
    _fsExtra.default.emptyDir(_path.CACHE_DIR).then(() => {
      logger.success("Cache folder has been emptied!");
    }).catch(err => {
      console.error(err);
    });
  }

  if (!i && !d) {
    logger.warn("Please use -i, --info to display cache information or -d, --delete to delete cache files.");
  }
};

var _default = cache;
exports.default = _default;