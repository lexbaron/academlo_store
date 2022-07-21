const { Sequelize, DataTypes } = require('sequelize');

const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const database = new Sequelize ({
    database: process.env.DB,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    logging: false
});

module.exports = { database, DataTypes };