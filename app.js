const express = require('express');

const { AppError } = require('./utils/appError.utils');
const { globalErrorHandler } = require('./controllers/error.controllers');

const { usersRouter } = require('./routes/users.routes');
const { productsRouter } = require('./routes/products.routes');

const app = express();

app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);

app.all('*', ( req, res, next ) => {
    next(
        new AppError(`${req.method} ${req.originalUrl} not found at this server`, 404)
    );
});

app.use(globalErrorHandler);

module.exports = { app };