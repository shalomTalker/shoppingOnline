const Orders = require('./schemas/order.shema');

module.exports = {
    //Takes all orders
    getAll: () =>{
        return Orders.find({}).populate('user').populate({
            path: 'products.product',populate: { path: 'product' }}).populate({
                path: 'products.product',populate: { path: 'category' }});
    },
    //Creating a new order
    create: (ProductObj) => {
        let Order = new Orders(ProductObj);
        return Order.save();
    },
    //Looking for an order by id
    byId: (id) => {
        return Orders.findOne({_id: id})
        .populate('user', ['role','email','firstName','lastName']).populate('products.product');
    },
}