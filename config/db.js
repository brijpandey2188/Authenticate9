const dotenv = require("dotenv");
dotenv.config();
const Sequelize = require('sequelize');

exports.sequelize = new Sequelize(
    process.env.DB_SCHEMA,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
);