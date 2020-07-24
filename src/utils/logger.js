import chalk from "chalk";
import logSymbols from "log-symbols";

export const error = (...str) => {
  console.log(chalk.red(`[summer-cli]: ${str.join(" ")} ${logSymbols.error}`));
};

export const warn = (...str) => {
  console.log(chalk.yellow(`[summer-cli]: ${str.join(" ")} ${logSymbols.warning}`));
};

export const info = (...str) => {
  console.log(`[summer-cli]: ${str.join(" ")} ${logSymbols.info}`);
};

export const success = (...str) => {
  console.log(chalk.green`[summer-cli]: ${str.join(" ")} ${logSymbols.success}`);
};
