const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Landing Page Untuk Dokumentasi API");
});

// ENDPOINT FOR LIST
app.get("/list", (req, res) => {
  const data = db.loadData();
  response(200, data, "success", res);
});

// ENDPOINT DETAIL
app.get("/detail/:id", (req, res) => {
  const id = req.params.id;
  const data = db.loadData();
  const item = data.find((item) => item.id === parseInt(id));

  if (item) {
    response(200, item, "success", res);
  } else {
    response(404, null, "Not found", res);
  }
});

// ENDPOINT DASHBOARD
app.get("/dashboard", (req, res) => {
  const data = db.loadData();
  res.render("dashboard", {
    list: data,
    title: "Selamat Datang di Backend Restozain",
  });
});

// INSERT DATA
app.post("/push", (req, res) => {
  const data = db.loadData();
  const newItem = {
    id: data.length + 1,
    name: req.body.name,
    description: req.body.description,
    picture: req.body.picture,
    city: req.body.city,
    rating: req.body.rating,
  };

  data.push(newItem);
  db.saveData(data);
  res.redirect("/dashboard");
});

// UPDATE DATA
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const data = db.loadData();
  const index = data.findIndex((item) => item.id === parseInt(id));

  if (index !== -1) {
    data[index] = {
      id: parseInt(id),
      name: req.body.name,
      description: req.body.description,
      picture: req.body.picture,
      city: req.body.city,
      rating: req.body.rating,
    };
    db.saveData(data);
    response(200, data[index], "success", res);
  } else {
    response(404, null, "Not found", res);
  }
});

// DELETE DATA
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const data = db.loadData();
  const filteredData = data.filter((item) => item.id !== parseInt(id));

  if (filteredData.length < data.length) {
    db.saveData(filteredData);
    response(200, null, "success", res);
  } else {
    response(404, null, "Not found", res);
  }
});

app.listen(port, () => {
  console.log(`Server Berjalan di Port ${port}`);
});
