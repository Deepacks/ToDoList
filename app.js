const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const fillDB = require(__dirname + "/fillDB.js");
const logging = require(__dirname + "/logging.js");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
mongoose.set("useFindAndModify", false);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
};
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

app.get("/fill", (req, res) => {
  fillDB(Item);
  res.redirect("/");
});

app.get("/", (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      logging(req, res);
      res.render("list", {
        listTitle: "Today",
        items: items,
      });
    }
  });
});

app.get("/:listName", (req, res) => {
  const listName = _.capitalize(req.params.listName);
  List.findOne({ name: listName }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      logging(req, res);
      if (!doc) {
        //Create new list
        const list = new List({
          name: listName,
          items: [],
        });
        list.save();
        setTimeout(() => {
          res.redirect("/" + listName);
        }, 200);
      } else {
        //Show existing list
        res.render("list", { listTitle: doc.name, items: doc.items });
      }
    }
  });
});

app.post("/", (req, res) => {
  const listName = req.body.list;

  const item = new Item({
    name: req.body.newItem,
  });

  if (listName === "Today") {
    logging(req, res);
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        logging(req, res);
        doc.items.push(item);
        doc.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/delete", (req, res) => {
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(req.body.checkbox, (err) => {
      if (err) {
        console.log(err);
      } else {
        logging(req, res);
      }
    });
    setTimeout(() => {
      res.redirect("/");
    }, 600);
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: req.body.checkbox } } },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          logging(req, res);
          setTimeout(() => {
            res.redirect("/" + listName);
          }, 600);
        }
      }
    );

    /*
    List.findOne({ name: listName }, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        logging(res, req);
        let i;
        doc.items.forEach((item, index) => {
          if (JSON.stringify(item._id) === JSON.stringify(req.body.checkbox)) {
            i = index;
          }
        });
        doc.items.splice(i, 1);
        doc.save();
        setTimeout(() => {
          res.redirect("/" + listName);
        }, 600);
      }
    });
    */
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
