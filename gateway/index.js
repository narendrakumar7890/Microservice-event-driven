const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());

app.use(express.json());

app.listen(3000, () => {
  console.log("Gateway Server listen on PORT 3000");
});
