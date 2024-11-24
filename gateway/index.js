const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const dotEnv = require("dotenv");
const logger = require("./logger"); // Import the logger middleware

const app = express();
dotEnv.config();

app.use(cors());

// Use the logger middleware
app.use(logger);

app.use(express.json());

app.use("/customer", proxy(`http://localhost:${process.env.CUSTOMER_PORT}`)); // customer

app.use("/shopping", proxy(`http://localhost:${process.env.SHOPPING_PORT}`)); // shopping

app.use("/", proxy(`http://localhost:${process.env.PRODUCT_PORT}`)); // product

app.listen(process.env.PORT, () => {
  console.log(`Gateway Server listen on PORT ${process.env.PORT}`);
});
