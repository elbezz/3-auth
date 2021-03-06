const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//import routes
const authRoute = require("./routes/auth");

//connect to db
mongoose.connect(process.env.DATABASE_URL, () =>
  console.log("connected to db"));
//midleware
app.use(express.json())



//routes midlewares
app.use("/api/user", authRoute);

app.listen(3000, () => console.log("Server is running"));
