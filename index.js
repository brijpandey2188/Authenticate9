const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const db = require("./config/db");
require('dotenv').config();
const fs = require('fs');
const https = require('https');

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: "100mb" }));

// Routes
require('./routes/index')(app);

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log("Server is running...");
});

// https
//     .createServer(
//         {
//             key: fs.readFileSync("privkey.pem"),
//             cert: fs.readFileSync("fullchain.pem"),
//         },
//         app
//     )
//     .listen(PORT || 3306, () => {
//         console.log(`Server started on PORT ${PORT || 3306}...`);
//     });

db.sequelize
    .authenticate()
    .then(() => {
        console.log("Connected to database");
    }).catch((error) => {
        console.error("Unable to connect to the database: ", error);
    });