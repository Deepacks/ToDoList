const moment = require("moment");
const chalk = require("chalk");
const log = console.log;

module.exports = (req, res) => {
  let now = `[${chalk.green(moment().format("HH:mm:ss"))}]`;
  let method = chalk.magenta(req.method);
  let route = chalk.blue(req.url);
  res.on("finish", function () {
    let code = chalk.yellow(this.statusCode);
    log(`${now} ${method} request received on ${route} with code ${code}`);
  });
};
