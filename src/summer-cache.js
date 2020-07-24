import fs from "fs-extra";
import { CACHE_DIR } from "./config/path";
import * as logger from "./utils/logger";

const cache = (d, i) => {
  if (i) {
    console.log("Templates and version information cache directory: ");
    logger.info(CACHE_DIR);
  }
  if (d) {
    fs.emptyDir(CACHE_DIR)
      .then(() => {
        logger.success("Cache folder has been emptied!");
      })
      .catch(err => {
        console.error(err);
      });
  }
  if (!i && !d) {
    logger.warn(
      "Please use -i, --info to display cache information or -d, --delete to delete cache files."
    );
  }
};

export default cache;
