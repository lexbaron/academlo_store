const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/users.models');
const { Product } = require('../models/products.models');
const { Order } = require('../models/orders.models');
const { Cart } = require('../models/carts.models');
const { ProductsInCart } = require('../models/productsInCart.models');

const { catchAsync } = require('../utils/catchAsync.utils');
const { AppError } = require('../utils/appError.utils');

dotenv.config({path: './config.env'});

const getAllUsers = catchAsync( async (req, res, next) => {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'status', 'role']});

    res.status(200).json({
        status: 'success',
        users
    });
});

const createUser = catchAsync( async( req, res, next ) => {
    const { username, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash( password, salt );

    const newUser = await User.create({
        username,
        email,
        password: hashPassword,
        role
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        newUser
    });
});

const login = catchAsync( async( req, res, next ) => {
    const { email, password } = req.body;

    const user = await User.findOne({where: {email, status: 'active'}});

    if(!user){
        next( new AppError('credentials invalid', 400));
    };

    const isPasswordValid = await bcrypt.compare( password, user.password );

    if(!isPasswordValid){
        next ( new AppError('credentials invalid', 400));
    };

    const token = await jwt.sign({id: user.id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(200).json({
        status: 'success',
        token
    });
});

const getAllUserProducts = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req;

    const userProducts = await Product.findAll({ where: {userId: sessionUser.id} });

    res.status(200).json({
        status: 'success',
        userProducts
    });
});

const updateUser = catchAsync( async( req, res, next ) => {
    const { user } = req;
    const { username, email } = req.body;

    await user.update({
        username,
        email
    });

    res.status(204).json({
        status: 'success'
    });
});

const deleteUser = catchAsync( async( req, res, next ) => {
    const { user } = req;

    await user.update({ status: 'deleted' });

    res.status(204).json({
        status: 'success'
    });
});

const getAllUserOrders = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req;

    const userOrders = await Order.findAll({ 
        attributes: ['id', 'totalPrice'],
        where: {userId: sessionUser.id},
        include: {
            model: Cart,
            attributes: ['id', 'status'],
            include: [
                {model: User, attributes: ['id', 'email', 'status']},
                {
                    model: ProductsInCart, 
                    attributes: ['quantity', 'status'],
                    include: {
                        model: Product,
                        attributes: ['id', 'title', 'price']
                    }
                }
            ]
        }
    });

    res.status(200).json({
        status: 'success',
        userOrders
    });
});

const getUserOrdersById = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req;
    const { id } = req.params;

    const userOrder = await Order.findOne({  attributes: ['id', 'totalPrice'],
    where: {id, userId: sessionUser.id},
    include: {
        model: Cart,
        attributes: ['id', 'status'],
        include: [
            {model: User, attributes: ['id', 'email', 'status']},
            {
                model: ProductsInCart, 
                attributes: ['quantity', 'status'],
                include: {
                    model: Product,
                    attributes: ['id', 'title', 'price']
                }
            }
        ]
    } });

    if(!userOrder){
        return next(new AppError('order not found', 404));
    };

    res.status(200).json({
        status: 'success',
        userOrder
    });
});

module.exports = { createUser, login, getAllUserProducts, updateUser, deleteUser, getAllUserOrders, getUserOrdersById, getAllUsers };