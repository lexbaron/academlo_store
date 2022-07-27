const { User } = require('./users.models');
const { Product } = require('./products.models');
const { Cart } = require('./carts.models');
const { ProductsInCart } = require('./productsInCart.models');
const { Order } = require('./orders.models');
const { ProductImage} = require('./productImgs.models');
const { Category } = require('./categories.models');


const initModels = () => {

    User.hasMany(Product);
    Product.belongsTo(User);

    User.hasMany(Order);
    Order.belongsTo(User);

    User.hasOne(Cart);
    Cart.belongsTo(User);

    Product.hasMany(ProductImage);
    ProductImage.belongsTo(Product);

    Category.hasOne(Product);
    Product.belongsTo(Category);

    Cart.hasMany(ProductsInCart);
    ProductsInCart.belongsTo(Cart);

    Product.hasOne(ProductsInCart);
    ProductsInCart.belongsTo(Product);

    Cart.hasOne(Order);
    Order.belongsTo(Cart);
};

module.exports = { initModels };