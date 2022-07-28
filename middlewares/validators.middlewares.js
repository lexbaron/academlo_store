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

const createProductsValidator = [
    body('title').notEmpty().withMessage('title cannot be empty').isString().withMessage('must provide a string'),
    body('description').notEmpty().withMessage('description cannot be empty').isString().withMessage('must provide a string'),
    body('price').
    notEmpty().
    withMessage('price cannot be empty').
    isNumeric().
    withMessage('price must be a number'),
    body('categoryId').
    notEmpty().
    withMessage('category id cannot be empty').
    isNumeric().
    withMessage('category id must be a number'),
    body('quantity').
    notEmpty().
    withMessage('quantity cannot be empty').
    isNumeric().
    withMessage('quantity must be a number'),
    checkResult
];

module.exports = { createUsersValidator };
