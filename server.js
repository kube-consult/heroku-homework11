// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

class dbObj {
  constructor() {
    this.db;
    this.id = 0
  }
  async read() {
    const data = await readFileAsync("db/db.json", "utf8");
    //console.log("pf test ", data);
    this.db = JSON.parse(data);
    this.renderNumbers();
    //console.log(this.db);
  }
  renderNumbers() {
    this.id = 0;
    this.db.forEach(element => {
      //console.log(element);
      element.id = this.id;
      this.id++;
    });
  }
  async newNotes(obj) {
    this.db.push(obj);
    this.renderNumbers();
    await this.write();
  }
  async delNotes(num) {
    this.db.splice(num,1);
    this.renderNumbers();
    await this.write();
  }
  async write() {
    //console.log(this.db);
    const data = JSON.stringify(this.db);
    await writeFileAsync("db/db.json", data);
  }
}

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  return res.json(notes.db);
});

app.get("/api/notes/:id", function (req, res) {
  var chosen = req.params.id;

  console.log(chosen);

  for (var i = 0; i < notes.db.length; i++) {

    if (chosen == notes.db[i].id) {
      return res.json(notes.db[i]);
    }
  }

  return res.json(false);
});

app.post("/api/notes", function (req, res) {
  const newNote = req.body;
  //console.log("entered post");
  //console.log(newNote);
  notes.newNotes(newNote);
  res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
  const delNote = req.params.id;
  //console.log(delNote);
  notes.delNotes(delNote);
  res.json(true);
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

const notes = new dbObj();

init();
async function init() {
  try {
    await notes.read();
  } catch (err) {
    console.log(err);
  }
}