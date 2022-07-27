const express = require('express');

const { addProductToCart,
    updateProductInCart, 
    getAllProductsInCart, 
    removeProductFromCart, 
    purchaseCart 
} = require('../controllers/cart.controllers');

const { protectSession } = require('../middlewares/auth.middlewares');
const { productInCartExist } = require('../middlewares/productCart.middlewares');

const cartRouter = express.Router();

cartRouter.use(protectSession);

cartRouter.post('/add-product', addProductToCart);

cartRouter.patch('/update-cart', updateProductInCart);

cartRouter.get('/me', getAllProductsInCart);

cartRouter.delete('/:productId', removeProductFromCart);

cartRouter.post('/purchase', purchaseCart)

module.exports = { cartRouter };