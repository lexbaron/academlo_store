const { User } = require('../models/users.models');

const { AppError } = require('../utils/appError.utils');
const { catchAsync } = require('../utils/catchAsync.utils');

const userExist = catchAsync( async(req, res, next) => {
    const { id } = req.params;

    const user = await User.findOne({ where: { id, status: 'active' } });

    if(!user){
        return next( new AppError('user not found', 404));
    };

    req.user = user;
    next();
});

module.exports = { userExist };