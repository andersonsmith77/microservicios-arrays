const server = require("./src/app");

server.listen(process.env.PORT || 7000, () => {
  console.log(`Lenguages Service working in port: ${process.env.PORT || 7000}`);
});