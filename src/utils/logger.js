import chalk from "chalk";
import logSymbols from "log-symbols";

export const error = (...str) => {
  console.log(`${chalk.red("error")} ${str.join(" ")} ${logSymbols.error}`);
};

export const warn = (...str) => {
  console.log(`${chalk.yellow("warning")} ${str.join(" ")} ${logSymbols.warning}`);
};

export const info = (...str) => {
  console.log(`${chalk.blue("info")} ${str.join(" ")} ${logSymbols.info}`);
};

export const success = (...str) => {
  console.log(`${chalk.green("success")} ${str.join(" ")} ${logSymbols.success}`);
};
