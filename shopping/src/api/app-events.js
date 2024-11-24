const ShoppingService = require("../services/shopping-service");

module.exports = (app) => {
  const service = new ShoppingService();
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;
    console.log("payload: ", payload);
    //handle subscribe events
    service.SubscribeEvents(payload);

    console.log("========= Shopping Service Received Event ============");
    console.log(payload);
    res.json(payload);
  });
};
