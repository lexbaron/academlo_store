const { app } = require('./app');

const { Cart } = require('./models/carts.models');
const { Order } = require('./models/orders.models');
const { ProductImage } = require('./models/productImgs.models');
const { ProductsInCart } = require('./models/productsInCart.models');


const { database } = require('./utils/database.utils');

database.authenticate()
    .then(console.log('database authenticated'))
    .catch(err => console.log(err));

// Cart.sync({})
//     .then(console.log('database synced'))
//     .catch(err => console.log(err));

// Order.sync({})
//     .then(console.log('database synced'))
//     .catch(err => console.log(err));

// ProductImage.sync({})
//     .then(console.log('database synced'))
//     .catch(err => console.log(err));

// ProductsInCart.sync({})
//     .then(console.log('database synced'))
//     .catch(err => console.log(err));

database.sync({})
    .then(console.log('database synced'))
    .catch(err => console.log(err));

app.listen('4000', () =>{
    console.log('server is running!');
});