const { Order } = require('../models/orders.models');

const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const orderExist = catchAsync( async(req, res, next) => {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id } });

    if(!order){
        return next( new AppError('order not found', 404));
    };

    req.order = order;
    next();
});

module.exports = { orderExist };