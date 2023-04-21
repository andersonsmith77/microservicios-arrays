const express = require("express"); // importa Express
const axios = require("axios"); // importa Axios
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library

const logger = (message) => console.log(`Author Services: ${message}`);

const authorsMicroserviceUrl = "http://authors:3000/api/v2/authors";
const booksMicroserviceUrl = "http://books:4000/api/v2/books";

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  }
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
})

// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  })
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  }
  return res.send(response); // devuelve la respuesta al cliente
})

router.get("/authorId/:authorId([0-9]+)", (req,res) => {
  const authorId = parseInt(req.params.authorId)

  const bookList = data.dataLibrary.books.find((book) => {
    return book.authorid === authorId;
  })

  const response = {
    service: "books",
    architecture: "microservices",
    length: bookList.length,
    data: bookList,
  }

  return res.send(response);
})

router.get("/authorBooks/:authorName", async (req, res) => {
  const authorName = req.params.authorName;

  let authorId;

  try {
    const author = await axios.get(`${authorsMicroserviceUrl}/author/${authorName}`);
    authorId = author.data.data[0].id;

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error trying to communicate with the authors service.");
  }

  try {
    const bookList = await axios.get(`${booksMicroserviceUrl}/authorId/${authorId}`);

    const response = {
      service: "books",
      architecture: "microservices",
      length: bookList.data.length,
      data: bookList.data,
    }

    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error with the books service.");
  }
})

router.get("/:searchType(ofYear|sinceYear|untilYear)/:year([0-9]+)", (req, res) => {
  const year = parseInt(req.params.year)
  const searchType = req.params.searchType

  let searchTypePredicate;

  if (searchType === "ofYear") {
    searchTypePredicate = (book) => book.year === year;
  }

  if (searchType === "sinceYear") {
    searchTypePredicate = (book) => book.year >= year;
  }

  if (searchType === "untilYear") {
    searchTypePredicate = (book) => book.year <= year;
  }

  if (!searchTypePredicate) {
    return res.status(400).send("Invalid searchType parameter");
  }

  const bookList = data.dataLibrary.books.filter(searchTypePredicate);

  const response = {
    service: "books",
    architecture: "microservices",
    length: bookList.length,
    data: bookList,
  }

  return res.send(response);
})

router.get("/yearsRange/:fromYear([0-9]+)-:toYear([0-9]+)", (req, res) => {
  const firstYear = parseInt(req.params.from);
  const lastYear = parseInt(req.params.to);

  const bookList = data.dataLibrary.books.filter((book) => {
    return book.year >= firstYear && book.year <= lastYear; 
   })
 
   const response = {
     service: "books",
     architecture: "microservices",
     length: bookList.length,
     data: bookList,
   }
 
   return res.send(response);
})

router.get("/distributedIn/:country", (req, res) => {
  const countryName = req.params.country;

  let booksList = [];

  data.dataLibrary.books.forEach(book => {
    const country = book.distributedCountries.find(country => country === countryName)
    
    if (country !== undefined) {
      booksList.push(book.title);
    }
  })

  const response = {
    service: "books",
    architecture: "microservices",
    length: booksList.length,
    data: {
      books: booksList,
    },
  }

  return res.send(response);
})

module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
