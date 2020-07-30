## summer-cli

![version](https://img.shields.io/github/package-json/v/Xiaolong96/summer-cli)

一个用于快速搭建前端项目的简单 CLI（Command-Line Interface）

### Installation

```node
npm install -g summer-cli
```

### Usage

初始化项目模版

```js
  summer-cli init <project-name>
  // or sc i <project-name>
```

创建远程仓库，关联本地项目，上传 Github

```js
  summer-cli upload --username [username] --token [token]
  // or sc up
```

删除版本信息和脚手架模版缓存

```js
  summer-cli cache --delete
  // or sc c -d

  summer-cli cache --info // 查看缓存信息
  // or sc c -i
```

> 版本信息 7 天检查一次是否有更新；
> 首次拉取脚手架模版后会将其缓存到当前用户主目录的 .summer-cli 文件夹下，即 `path.resolve(os.homedir(), ".summer-cli")`，以提升执行速度。

```cmd
Usage: sc [options] [command]

Options:
  -v, --version        Print version information and quit
  -h, --help           display help for command

Commands:
  init|i <project>     Create a new project 🌶
  upload|up [options]  Create remote repository, associate the project and upload to Github 🌶
  cache|c [options]    View or delete cache files 🌶
  help [command]       display help for command
```
