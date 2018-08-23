const orderModel = require('../models/order.model');
const cartModel = require('../models/cart.model')
const usersModel = require('../models/users.model');


module.exports = {
    getAll: async (req, res) => {
        if (req.userData.role != 2) {
            res.status(403).end();
        } else {
            try {
                //Returns all orders
                let orders = await orderModel.getAll();
                res.json(orders);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    getAllShippingDates: async(req,res)=>{
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                let dates = [];
                //Returns all dates of orders
                let orders = await orderModel.getAll();
                for(let o of orders){
                    dates.push(o.shippingDate[0]);
                }
                res.json(dates);
                
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    getNumberOfOrders: async(req,res) =>{
        try{
            let orders = await orderModel.getAll();
            let ret = orders.length;
            res.json(ret);
        }
        catch(e){
            console.log(e);
            res.status(400).end(e);
        }
    },
    createOrder: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            let cart;
            let ret;
            let orders;
            let count = 0;
            try {
                let orderObj = {
                    user: req.userData.id,
                    shippingDate: {
                        year: req.body.year,
                        month: req.body.month+1,
                        date: req.body.date
                    },
                    payment: {
                        creditCard: req.body.creditCard,
                    },
                    products: [],
                    address: {
                        "city": req.body.city,
                        "street": req.body.street
                    },
                    totalPrice: null
                }
                
                let date = `${orderObj.shippingDate.date}/${orderObj.shippingDate.month}/${orderObj.shippingDate.year}`;
                date = new Date(date);
                //Checking that the date is not before tomorrow
                if (date < tomorrow) {
                    throw "Shipments can be selected from tomorrow onwards"
                }
                //Checks that a cart exists for the user
                cart = await cartModel.findCartPerId(orderObj.user);
                if (!cart) {
                    throw "Cart does not exist"
                }
                //Checking that day is not taken over 3 orders
                orders = await orderModel.getAll();
                for(let date of orders){
                    if(date.shippingDate[0].date == orderObj.shippingDate.date && date.shippingDate[0].month == orderObj.shippingDate.month && date.shippingDate[0].year == orderObj.shippingDate.year){
                        count++;
                    }
                }
                if(count >= 3){
                    throw "Day is invalid"
                }
                //Checks that there is no data missing
                if (orderObj.shippingDate.year == '' || orderObj.shippingDate.month == '' || orderObj.shippingDate.date == '' || orderObj.payment.creditCard == '' || orderObj.address.city == '' || orderObj.address.street == '') {
                    throw "Missing Fields";
                }
                orderObj.products = cart.products;
                orderObj.totalPrice = cart.totalPrice;
                ret = await orderModel.create(orderObj);
                if (!ret) {
                    throw "Unknown Error"
                }
                //Removing the cart
                await cartModel.delete(cart._id);
                let lastOrder = {
                    id: req.userData.id,
                    oid: ret._id,
                    date: ret.orderCreate
                }
                await usersModel.updateLastOrder(lastOrder);
                res.json(ret);

            } catch (e) {
                console.log(e);
                res.status(404).end(e);
            }
        }
    },

    getOrder: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                let id = req.params.id;
                //Returns order by ID
                let order = await orderModel.byId(id);
                if (!order) {
                    throw "Order not found";
                }
                if (order.user._id != req.userData.id) {
                    throw "Order does not belong to the user";
                }
                res.json(order);

            } catch (e) {
                console.log(e);
                res.status(404).end(e);
            }
        }
    }



}