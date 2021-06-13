const express = require("express");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = [];
const workItems = [];

app.get("/", (req, res) => {
  res.render("list", { listTitle: date.getDate(), items: items });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", items: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
