const cartModel = require('../models/cart.model');

module.exports = {

    createCart: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                let cart = null;
                let total = 0;
                let id = req.userData.id;
                //Makes a new carriage, if there is a return cart that exists
                let cartExists = await cartModel.findCartPerId(id);
                if (cartExists) {
                    cart = cartExists;
                    total = await cartModel.calculateTotalPrice(id);
                } else {
                    await cartModel.create(id);
                    cart = await cartModel.findCartPerId(id);
                }
                res.json({
                    cart,
                    total
                })
            } catch (e) {
                res.status(400).end(e);
            }
        }
    },
    getCart: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                let id = req.userData.id;
                //Returns cart by id
                let cart = await cartModel.findCartPerId(id);
                if (!cart) {
                    throw "cart does not exist"
                }
                res.json({"active":true,"cart":cart});
            } catch (e) {
                res.status(400).end(e);
            }
        }
    },
    addToCart: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                let ret;
                let addObj = {
                    id: req.userData.id,
                    pid: req.body.productID,
                    amount: req.body.amount
                }
                //Checks that there is no data missing
                if(addObj.id == '' || addObj.pid == '' || addObj.amount == ''){
                    throw "missing details"
                }
                //Checks if the cart exists
                let cartExists = await cartModel.findCartPerId(addObj.id);
                if (!cartExists) {
                    throw "cart does not exist"
                }
                //Checks if an existing product is in the cart, if there is a quantity update, if not adding new
                let itemExists = await cartModel.productExists(addObj)
                if (itemExists) {
                    ret = await cartModel.updateProduct(addObj);
                } else {
                    ret = await cartModel.addToCart(addObj);
                }
                let total = await cartModel.calculateTotalPrice(addObj.id);
                res.json({
                    ret,
                    total
                })
            } catch (e) {
                res.status(400).end(e);
            }
        }
    },
    removeFromCart: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                let removeObj = {
                    id: req.userData.id,
                    pid: req.params.id
                }
                if(removeObj.id == '' || removeObj.pid == ''){
                    throw "missing details"
                }
                //Removing item from cart
                let removeItem = await cartModel.removeFromCart(removeObj);
                if (removeItem.nModified == 1) {
                    ret = true;
                } else {
                    ret = false;
                }
                let price = await cartModel.calculateTotalPrice(removeObj.id);
                res.json({
                    ret,
                    price
                })
            } catch (e) {
                res.status(400).end(e);
            }
        }
    }
    
}