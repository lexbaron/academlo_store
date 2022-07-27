const dotenv = require('dotenv');

const { AppError } = require('../utils/appError.utils');

dotenv.config({path: './config.env'});

const sendErrorDev = (err, req, res) =>{
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'fail',
        message: err.message,
        error: err,
        stack: err.stack
    });
};

const sendErrorProd = (err, req, res) =>{
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'fail',
        message: err.message || 'something went wrong'
    });
};

const handleUniqueEmailError = () =>{
    return new AppError('the email you entered is already taken', 400);
};

const handleJWTExpiredError = () =>{
    return new AppError('your session has expired, please logging again!!', 401);
};

const globalErrorHandler = ( err, req, res, next ) => {

    if( process.env.NODE_ENV === 'development' ) {
        sendErrorDev(err, req, res);
    }else if( process.env.NODE_ENV === 'production' ) {
        let error = {...err};

        error.message = err.message;

        if(err.name === 'SequelizeUniqueConstraintError'){
            error = handleUniqueEmailError();
        };

        if(err.name === 'TokenExpiredError'){
            error = handleJWTExpiredError();
        };

        sendErrorProd(error, req, res);
    };
};

module.exports = { globalErrorHandler };