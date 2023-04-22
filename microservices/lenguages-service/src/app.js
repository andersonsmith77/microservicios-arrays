
const express = require("express");

const lenguages = require("../routes/lenguages");

const app = express();

app.use("/api/v2/lenguages", lenguages);

module.exports = app;