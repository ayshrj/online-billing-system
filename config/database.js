const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://admin:4294967296@plotlineapi.scohmsq.mongodb.net/Node-API?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err);
});

module.exports = mongoose;
