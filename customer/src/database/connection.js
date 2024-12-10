const mongoose = require("mongoose");
const { DB_URL } = require("../config");

module.exports = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Db Connected For Customer Service");
  } catch (error) {
    console.error(
      "Error ============ DB Connection Failed in Customer Service"
    );
    console.log(error);
    process.exit();
  }
};
