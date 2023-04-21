// Importamos la biblioteca Express
const express = require("express");
const axios = require("axios"); // importa Axios
// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");

const countriesArrays = Object.values(data.dataLibrary.countries);

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

const authorsMicroserviceUrl = "http://authors:3000/api/v2/authors";
const booksMicroserviceUrl = "http://books:4000/api/v2/books";

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});

router.get("/countryInfo/:capital", async (req, res) => {
  const capital = req.params.capital;

  const country = countriesArrays.find(country => {
    return country.capital === capital;
  })

  let authorsList;
  let booksList;

  try {
    const authors = await axios.get(`${authorsMicroserviceUrl}/country/${country.name}`);
    authorsList = authors.data;

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error trying to communicate with the authors service.");
  }

  try {
    const books = await axios.get(`${booksMicroserviceUrl}/distributedIn/${country.name}`);
    booksList = books.data;

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error trying to communicate with the books service.");
  }
  
  const response = {
    service: "countries",
    architecture: "microservices",
    data: {
      country: country.name,
      authors: authorsList,
      books: booksList,
    },
  };
  
  return res.send(response);
});

// Exportamos el router
module.exports = router;
