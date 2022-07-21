const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.utils');

const checkResult = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const errorMsg = errors.array().map(err => err.msg);

        const message = errorMsg.join('. ');

        return next(new AppError(message, 400));
    }

    next();
};

const createUsersValidator = [
    body('username').notEmpty().withMessage('name cannot be empty'),
    body('email').notEmpty().withMessage('email cannot be empty').isEmail().withMessage('must provide a valid email'),
    body('password').
    notEmpty().
    withMessage('password cannot be empty').
    isLength({min: 8}).
    withMessage('the password must be at least 8 characters length').
    isAlphanumeric().
    withMessage('password must have letters and numbers'),
    checkResult
];

module.exports = { createUsersValidator };
