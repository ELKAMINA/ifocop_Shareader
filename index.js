const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

// dotenv.config() permet de configurer des adresses secrètes pour protéger les données.
dotenv.config();

// Mongoose sert à modéliser des données. It acts as an intermediate between mongodb and server side language(like NodeJs). See this on stackoverflow : https://stackoverflow.com/questions/55604057 what-is-mongo-url-and-what-should-it-be-set-to
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, ()=> {
    console.log("Mongoose connecté.");
});

// On va créer le middleware
    // app.use(express.json()) est un body parser pour les requêtes POST
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);



app.listen(8800, () =>
{
    console.log("Backend Server is on");
}
)