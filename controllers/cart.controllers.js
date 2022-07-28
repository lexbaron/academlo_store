const { Cart } = require('../models/carts.models');
const { ProductsInCart } = require('../models/productsInCart.models');
const { User } = require('../models/users.models');
const { Product } = require('../models/products.models');
const { Order } = require('../models/orders.models');
const { Category } = require('../models/categories.models');

const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const addProductToCart = catchAsync( async(req, res, next) => {
    const { productId, quantity } = req.body;
    const { sessionUser } = req;

    const product = await Product.findOne({ where: {id: productId, status: 'active'}});

    if(!product){
        return next( new AppError('product not found', 404));
    } else if (quantity > product.quantity){
        return next(new AppError(`only ${product.quantity} units available`, 404));
    };

    const cart = await Cart.findOne({ where: {userId: sessionUser.id, status: 'active'} });   

    if(!cart){
        const newCart = await Cart.create({ userId: sessionUser.id });

        await ProductsInCart.create({
            cartId: newCart.id,
            productId,
            quantity,
        });
    }else{
        const productExist = await ProductsInCart.findOne({ where: {productId, cartId: cart.id}});

        if(productExist){
            if(productExist.status === 'removed'){
                await productExist.update({ quantity, status: 'active' });
                
                res.status(200).json({
                    status: 'success',
                    productExist
                });
            }else if(productExist.status === 'active'){
                return next( new AppError('this product already exist on this cart!', 404));
            }
        }else{
    
        const newProductInCart = await ProductsInCart.create({ cartId: cart.id, productId, quantity });
    
        res.status(201).json({
            status: 'success',
            newProductInCart
        });
    }
    };

});

const updateProductInCart = catchAsync( async(req, res, next) => {
    const { sessionUser } = req;
    const { productId, newQuantity } = req.body;

    const userCart = await Cart.findOne({ where: { userId: sessionUser.id, status: 'active' } });

    if(!userCart){
        return next( new AppError('you do not have a cart', 404));
    };

    const productInCart = await ProductsInCart.findOne({ where: { cartId: userCart.id , productId, status:'active' } });

    if(!productInCart){
        return next( new AppError('this product does not exist in this cart', 404));
    };

    const productStock = await Product.findOne({ where: { id: productId } }); 

    if( newQuantity > productStock.quantity ){
        return next( new  AppError(`only ${productStock.quantity} units available`, 404));
    };

    if(newQuantity <= 0){
        await productInCart.update({ status: removed });
    };

    await productInCart.update({ 
        quantity: newQuantity
    });

    res.status(204).json({
        status: 'success'
    });
});

const removeProductFromCart = catchAsync( async (req, res, next) => {
    const { productId } = req.params;

    const productExist = await ProductsInCart.findOne({ where: { productId, status: 'active' } });

    if(!productId){
        return next( new AppError('this product does not exist in this cart', 404));
    };

    await productExist.update({ quantity: 0, status: 'removed' });

    res.status(204).json({
        status: 'success'
    });
});

const purchaseCart = catchAsync( async (req, res, next) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({ where: {userId: sessionUser.id, status: 'active'} });

    if(!cart){
        return next( new AppError('you do not have a cart active to purchase', 404));
    };

    const cartProducts = await ProductsInCart.findAll({ where: {cartId: cart.id, status: 'active'} });

    if(!cartProducts){
        return next( new AppError('you do not have products on this cart', 404));
    };

    let totalPrice = 0;

    const cartPromisePurchased = cartProducts.map( async product => {
        let stockProduct = await Product.findOne({ where: {id: product.productId} });

        let result = stockProduct.quantity - product.quantity;

        let productPrice = stockProduct.price * product.quantity;

        totalPrice += productPrice;

        await stockProduct.update({ quantity: result });

        await product.update({ status: 'purchased' });
    });

    await Promise.all(cartPromisePurchased);

    const newOrder = await Order.create({
        userId: sessionUser.id,
        cartId: cart.id,
        totalPrice
    });

    await cart.update({ status: 'purchased' });

    res.status(200).json({
        status: 'success',
        newOrder
    });
});

const getAllProductsInCart = catchAsync( async (req, res, next) => {
    const { sessionUser } = req;

    const userCart = await Cart.findOne({ 
        attributes: ['id', 'userId', 'status'],
        where: {userId: sessionUser.id, status: 'active'},
        include:[ 
            {
                model: ProductsInCart, 
                attributes: ['quantity', 'status'],
                include: {
                    model: Product, 
                    attributes: ['id', 'title', 'description', 'quantity', 'price', 'status'],
                    include: {model: Category, attributes: ['id', 'name', 'status']}
                }
            },
            {model: User, attributes: ['id', 'username', 'email', 'status']}
        ]
    });

    if(!userCart){
        return next( new AppError('this user does not have a cart', 404));
    };

    res.status(200).json({
        status: 'success',
        userCart
    });
});



module.exports = { addProductToCart, updateProductInCart, getAllProductsInCart, removeProductFromCart, purchaseCart };