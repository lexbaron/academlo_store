const { app } = require('./app');

const { Cart } = require('./models/carts.models');
const { Order } = require('./models/orders.models');
const { ProductImage } = require('./models/productImgs.models');
const { ProductsInCart } = require('./models/productsInCart.models');

const { initModels } = require('./models/initModels');


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

initModels();

database.sync({force: false})
    .then(console.log('database synced'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>{
    console.log('server is running!');
});