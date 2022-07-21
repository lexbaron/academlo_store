const { Product } = require('../models/products.models');

const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const productExist = catchAsync( async(req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOne({ where: { id, status: 'active' } });

    if(!product){
        return new AppError('product not found', 404);
    };

    req.product = product;
    next();
});

module.exports = { productExist };