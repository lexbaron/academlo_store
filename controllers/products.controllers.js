const { Product } = require('../models/products.models');
const { Category } = require('../models/categories.models');

const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

const createProduct = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req;
    const { title, description, price, categoryId, quantity } = req.body;

    const newProduct = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId: sessionUser.id
    });

    res.status(201).json({
        status: 'success',
        newProduct
    });
});

const getAllProducts = catchAsync( async( req, res, next ) => {
    const products = await Product.findAll({ where: {status: 'active'}});

    res.status(200).json({
        status: 'success',
        products
    })
});

const getProductById = catchAsync( async( req, res, next ) => {
    const { product } = req;

    res.status(200).json({
        status: 'success',
        product
    });
});

const updateProduct = catchAsync( async( req, res, next ) => {
    const { product } = req;
    const { title, description, price, quantity } = req.body;

    await product.update({ title,
        description, 
        price, 
        quantity 
    });

    res.status(204).json({
        status: 'success',
        product
    });
});

const deleteProduct = catchAsync( async( req, res, next ) => {
    const { product } = req;

    await product.update({ status: 'deleted' });

    res.status(204).json({
        status: 'success',
        product
    });
});

const getAllCategories = catchAsync( async( req, res, next ) => {
    const categories = await Category.findAll({ where: {status:'active'}});

    res.status(200).json({
        status: 'success',
        categories
    })
});

const createCategory = catchAsync( async( req, res, next ) => {
    const { name } = req.body;

    const newCategory = await Category.create({
        name
    });

    res.status(201).json({
        status: 'success',
        newCategory
    });
});

const updateCategory = catchAsync( async( req, res, next ) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findOne({ where: {id} });

    if(!category){
        return next(new AppError('category not found', 404));
    };

    res.status(204).json({
        status: 'success',
        category
    })
});

module.exports = { 
    createProduct,
    createCategory,
    getAllCategories, 
    getAllProducts, 
    getProductById, 
    updateCategory, 
    updateProduct, 
    deleteProduct 
};