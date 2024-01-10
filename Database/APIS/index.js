// Import packages
const express = require("express");
const api = require("./routes/api");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/api", api);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
