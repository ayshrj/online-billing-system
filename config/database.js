const mongoose = require("mongoose");

const dbURI =
  "mongodb+srv://admin:LfMAwEheGNJN0fHN@1nhjdsf.7rg0eol.mongodb.net/Node-API?retryWrites=true&w=majority";

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
