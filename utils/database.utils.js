const { Sequelize, DataTypes } = require('sequelize');

const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const database = new Sequelize ({
    database: config.env.DB,
    dialect: 'postgres',
    host: config.env.DB_HOST,
    password: config.env.DB_PASSWORD,
    port: config.env.DB_PORT,
    username: config.env.DB_USERNAME,
});

module.exports = { database, DataTypes };