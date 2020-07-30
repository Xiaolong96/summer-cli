import program from "commander";
import chalk from "chalk";
import * as logger from "./utils/logger";
import ora from "ora";
import { checkVersion } from "./utils/check-version";
import init from "./summer-init";
import upload from "./summer-upload";
import cache from "./summer-cache";

(async () => {
  // check version
  const spinner = ora();
  spinner.start("> check version ... ");

  // checkVersion(pkg) 返回 {hasNewer:Boolean, remoteVersion, localVersion}
  const versionInfo = await checkVersion("summer-cli");
  spinner.stop();

  // If the latest version is available, prompt the user
  if (versionInfo.hasNewer) {
    console.log();
    logger.warn(`  A newer version of ${chalk.magenta("summer-cli")} is available.`);
    console.log(`  latest:       ${chalk.green(versionInfo.remoteVersion)}`);
    console.log(`  installed:    ${chalk.green(versionInfo.localVersion)}`);
    console.log(`  Please upgrade via the command line: ${chalk.green("npm i -g summer-cli")}`);
    console.log();
  } else {
    // logger.success(`The current version is the latest@${versionInfo.localVersion}`);
    // console.log();
  }

  /**
   * summer-cli command list
   */

  program
    .command("init <project>")
    .description("Create a new project 🌶")
    .alias("i")
    .usage("<project-name> 🌶")
    .action(project => {
      init(project);
    });

  program
    .command("upload")
    .description("Create remote repository, associate the project and upload to Github 🌶")
    .alias("up")
    .usage("-u, --username [username] -t, --token [token] 🌶")
    .option("-u, --username [username]", "Github username")
    .option("-t, --token [token]", "Access token created by Github")
    .action(cmdObj => {
      upload(cmdObj.username, cmdObj.token);
    });

  program
    .command("cache")
    .description("View or delete cache files 🌶")
    .alias("c")
    .usage("-d, --delete -i, --info 🌶")
    .option("-d, --delete", "Delete cache")
    .option("-i, --info", "Show cache information")
    .action(cmdObj => {
      cache(cmdObj.delete, cmdObj.info);
    });

  // Project version
  program
    .version(
      require("../package.json").version,
      "-v, --version",
      "Print version information and quit"
    )
    .parse(process.argv);

  /**
   * When there is no parameter after the summer-cli command, the help information is output
   */
  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
  }
})();
