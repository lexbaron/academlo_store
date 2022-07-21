const express = require('express');

const { protectSession, protectUserAccount } = require('../middlewares/auth.middlewares');
const { userExist } = require('../middlewares/users.middlewares');
const { orderExist } = require('../middlewares/orders.middlewares');

const {
createUser,
deleteUser,
getAllUserOrders,
getAllUserProducts,
getUserOrdersById,
login,
updateUser,
getAllUsers
} = require('../controllers/users.controllers');

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);

usersRouter.post('/', createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/me', getAllUserProducts);

usersRouter.patch('/:id', userExist, protectUserAccount, updateUser);

usersRouter.delete('/:id', userExist, protectUserAccount, deleteUser);

usersRouter.get('/orders', getAllUserOrders);

usersRouter.get('/orders/:id',orderExist, getUserOrdersById);

module.exports = {usersRouter};