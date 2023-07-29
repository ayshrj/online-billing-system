const express = require("express");
const bodyParser = require("body-parser");
const database = require("./config/database");

app.use(bodyParser.json()); //Middleware

// Routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

//Server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
