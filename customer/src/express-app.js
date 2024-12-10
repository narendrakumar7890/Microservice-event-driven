const express = require("express");
const cors = require("cors");
const { customer, appEvents } = require("./api");
//const { CreateChannel, SubscribeMessage } = require("./utils");
const logger = require("./utils/logger"); // Import the logger middleware
const HandleErrors = require("./utils/error-handler");

module.exports = async (app, channel) => {
  app.use(express.json());
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
  // Use the logger middleware
  app.use(logger);

  //api
  //customer(app);
  //api
  customer(app, channel);

  //listen to events
  //appEvents(app);

  //const channel = await CreateChannel();

  //customer(app, channel);

  // error handling
  //app.use(HandleErrors);
};
