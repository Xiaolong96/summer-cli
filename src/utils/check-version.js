#!/usr/bin/env node

// 运行时加上 DEBUG=checkVersion 即可看到改命名空间下的 debug 信息
const debug = require("debug")("checkVersion");
const fs = require("fs-extra");
const axios = require("axios");
// 语义化版本
const semver = require("semver");
const { execSync } = require("child_process");
const packageJson = require("../../package");
const { CACHE_DIR, VERSION_CACHE_PATH } = require("../config/path");

/*
 * 判断是否到了要检查远程版本号的时间 7d
 * @params pkg: npm包名
 * @return Boolean
 */

const isToCheckRemote = () => {
  // 确保缓存目录存在，不存在则创建
  fs.ensureDirSync(CACHE_DIR, err => {
    console.log(err);
  });

  // 判断是否存在 version.json
  if (fs.existsSync(VERSION_CACHE_PATH)) {
    // 如果存在.cache/version.json 则读取其 time 跟当前时间对比
    const versionCache = fs.readFileSync(VERSION_CACHE_PATH, "utf-8");
    const versionCacheTime = JSON.parse(versionCache).time;
    const curTime = new Date().getTime();

    debug("%s", `versionCacheTime: ${versionCacheTime}`);
    // 如果超过 7 天 (7d = 1000x60x60x24x7 = 604800000s)
    // 标识需要检查远程版本号 return true, 否则不检查远程 return false
    if (curTime - parseInt(versionCacheTime, 10) >= 604800000) {
      return true;
    }

    return false;
  }
  // 不存在 version.json 时
  // 返回 true 标识需要检查远程版本号
  return true;
};

/*
 * 获取远程的版本号
 * @params pkg: npm包名
 * @return remoteVersion 例：0.1.0
 */

const getRemoteVersion = async pkg => {
  let remoteVersion = packageJson.version;

  // 如果已经7天没检查版本号了 则检查远程版本号
  if (isToCheckRemote()) {
    debug("%s", `isToCheckRemote: ${isToCheckRemote()}`);
    try {
      // 命令行方式获取版本号
      remoteVersion = execSync(`npm view ${pkg} version`)
        .toString()
        .trim();
      debug("%s", `通过 npm view <packname> version 获取远程版本号为: ${remoteVersion}`);
    } catch (err) {
      // 异步请求获取版本号
      const res = await axios.get(`https://registry.npmjs.org/${pkg}/latest`);

      debug("%s", `通过请求 ://registry.npmjs.org/${pkg}/latest 获取远程版本号为: ${res.version}`);

      remoteVersion = res.version;

      return res.version;
    } finally {
      debug("%s", `Remote version is : ${remoteVersion}`);

      // 把新的信息写入版本号文件内
      const obj = {
        time: new Date().getTime(),
        version: remoteVersion
      };
      fs.writeFileSync(VERSION_CACHE_PATH, JSON.stringify(obj), "utf-8");
    }
  } else {
    // 如果距离上次检查时间不足7天 则获取 `VERSION_CACHE_PATH` 里的 version
    const versionCache = fs.readFileSync(VERSION_CACHE_PATH, "utf-8");
    const versionCacheVersion = JSON.parse(versionCache).version;

    remoteVersion = versionCacheVersion || packageJson.version;
  }

  return remoteVersion;
};

/*
 * 获取当前版本号
 * @return localVersion 例：0.1.0
 */

const getLocalVersion = () => {
  const localVersion = packageJson.version;
  // console.log(localVersion);
  return localVersion;
};

/*
 * 检查版本号
 * @return Boolean
 */

const checkVersion = async pkg => {
  const localVersion = getLocalVersion();
  const remoteVersion = await getRemoteVersion(pkg);
  let hasNewer = false;

  // console.log('00--00--', semver.compare('16.4.0-alpha.5', '16.4.0-rc.1'));
  // 对比版本号 是否远程有更新的
  if (localVersion !== remoteVersion) {
    try {
      // compare(v1, v2): Return 0 if v1 == v2, or 1 if v1 is greater, or -1 if v2 is greater.
      // Sorts in ascending order if passed to Array.sort().
      hasNewer = semver.compare(remoteVersion, localVersion) === 1;
    } catch (err) {
      debug(
        "%s",
        `Semver.compare(v1, v2) is error, remoteVersion: ${remoteVersion}, localVersion: ${localVersion}`
      );
      return {
        hasNewer,
        localVersion,
        remoteVersion
      };
    }
  }

  debug(
    "%s",
    `checked version - local: ${localVersion}; remote: ${remoteVersion}; hasNewer: ${hasNewer}`
  );

  return {
    hasNewer,
    localVersion,
    remoteVersion
  };
};

exports.checkVersion = checkVersion;
