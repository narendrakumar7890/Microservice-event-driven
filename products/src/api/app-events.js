const ProductService = require("../services/product-service");

module.exports = (app) => {
  const service = new ProductService();

  app.use("/app-events", (req, res) => {
    const { payload } = req.body;

    console.log("========= Product Service Received Event ============");
    res.status(200).json(payload);
  });
};
