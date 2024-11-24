const ShoppingService = require("../services/shopping-service");

const UserAuth = require("./middlewares/auth");
const { PublishCustomerEvent } = require("../utils");

module.exports = (app) => {
  const service = new ShoppingService();
  //const userService = new UserService();

  app.post("/order", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
      const { data } = await service.PlaceOrder({ _id, txnNumber });
      const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");
      console.log("PublishCustomerEvent payload: ", payload);
      PublishCustomerEvent(payload);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/orders", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await service.GetOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const { data } = await service.getCart({ _id });

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
