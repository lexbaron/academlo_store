const { ProductsInCart } =require('../models/productsInCart.models');

const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const productInCartExist = catchAsync( async(req, res, next) => {
    const { id } = req.params;

    const productInCart = await ProductsInCart.findOne({ where: {id} });
    
    if(!productInCart){
        return next( new AppError('this product does not exist in this cart', 404));
    };

    req.productInCart = productInCart;
    next();
});

module.exports = { productInCartExist };