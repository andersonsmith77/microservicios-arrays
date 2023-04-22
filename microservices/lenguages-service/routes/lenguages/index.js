const express = require("express");
const csv = require('csv-parser');
const fs = require('fs');

const csvFilePath = "../../data/language-codes.csv";

const jsonData = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => jsonData.push(data))
  .on('end', () => {
    console.log(data);
  });

const router = express.Router();

const logger = (message) => console.log(`Lenguages Service: ${message}`);

const authorsMicroserviceUrl = "http://authors:3000/api/v2/authors";
const booksMicroserviceUrl = "http://books:4000/api/v2/books";
const countriesMicroserviceUrl = "http://countries:5000/api/v2/authors";

router.get("/", async (req, res) => {

  const response = {
    service: "lenguages",
    architecture: "microservices",
    data: jsonData,
  };
  logger("Get lenguages data");
  
  return res.send(response);
});

module.exports = router;