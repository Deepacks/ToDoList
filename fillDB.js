const logging = require(__dirname + "/logging.js");
const chalk = require("chalk");
const moment = require("moment");

module.exports = (Item) => {
  const item1 = new Item({
    name: "Welcome to your To Do List!",
  });
  const item2 = new Item({
    name: "Use the '+' button to add your task",
  });
  const defaultItems = [item1, item2];
  Item.insertMany(defaultItems, (err) => {
    if (err) {
      console.log(err);
    } else {
      let now = `[${chalk.green(moment().format("HH:mm:ss"))}]`;
      let method = chalk.magenta("POST");
      let route = chalk.blue("/fill");
      let code = chalk.yellow("200");
      console.log(
        `${now} ${method} request received on ${route} with code ${code}`
      );
    }
  });
};
