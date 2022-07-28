const express = require('express');

const {
    createProduct,
    createCategory,
    deleteProduct,
    getAllCategories,
    getAllProducts,
    getProductById,
    updateCategory,
    updateProduct
} = require('../controllers/products.controllers');

const { protectSession, protectUserProducts } = require('../middlewares/auth.middlewares');
const { productExist } = require('../middlewares/products.middlewares');

const productsRouter = express.Router();

productsRouter.get('/categories', getAllCategories );

productsRouter.get('/', getAllProducts );

productsRouter.get('/:id', productExist, getProductById );

productsRouter.use(protectSession);

productsRouter.post('/', createProduct);

productsRouter.patch('/:id', productExist, protectUserProducts, updateProduct);

productsRouter.delete('/:id', productExist, protectUserProducts, deleteProduct);

productsRouter.post('/categories', createCategory);

productsRouter.patch('/categories/:id', updateCategory);

module.exports = { productsRouter };