const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { AppError } = require('./utils/appError.utils');
const { globalErrorHandler } = require('./controllers/error.controllers');

const { usersRouter } = require('./routes/users.routes');
const { productsRouter } = require('./routes/products.routes');
const { cartRouter } = require('./routes/cart.routes');

const app = express();

app.use(express.json());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);

const limiter = rateLimit({
	max: 10000,
	windowMs: 60 * 60 * 1000,
	message: 'Number of requests have been exceeded',
});

app.use(limiter);

app.use(helmet());

app.use(compression());

if(process.env.NODE_ENV === 'development'){
    app.usr(morgan('dev'));
}else{
    app.usr(morgan('combined'));
}

app.all('*', ( req, res, next ) => {
    next(
        new AppError(`${req.method} ${req.originalUrl} not found at this server`, 404)
    );
});

app.use(globalErrorHandler);

module.exports = { app };