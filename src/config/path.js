const path = require("path");
const os = require("os");

// 本地的缓存文件夹
exports.CACHE_DIR = path.resolve(os.homedir(), ".summer-cli");

// 版本信息缓存路径
exports.VERSION_CACHE_PATH = path.resolve(os.homedir(), ".summer-cli", "version.json");

// 本地缓存的脚手架模板路径
exports.TEMPLATES_CACHE_DIR = path.resolve(os.homedir(), ".summer-cli", "templates");
