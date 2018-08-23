const Carts = require('./schemas/cart.schema');
const Products = require('./schemas/products.schema');

module.exports = {
    //Creating cart
    create: (id) => {
        let cart = new Carts({user: id});
        return cart.save();
    },
    //Looking for a cart by id
    findCartPerId: (id) => {
        return Carts.findOne({user: id})
               .populate('user', ['role','email','firstName','lastName']).populate('products.product').populate({
                path: 'products.product',populate: { path: 'category' }
            });
    },
    //Checks whether a product exists in the cart
    productExists: async (productExistsObj) => {
        let product = await Carts.find( { user: productExistsObj.id },  { products: { $elemMatch: { product: productExistsObj.pid} }, _id: 0 });
        return product[0].products[0] != null ? true : false
    },
    //Updating quantity of product in cart
    updateProduct: async(updateProduct) => {
        await Carts.update({user: updateProduct.id}, {
            $pull: {
                "products": { product: updateProduct.pid }
            }
        });
        return Carts.update({user: updateProduct.id}, {
            $push: {
                "products": { product: updateProduct.pid , amount: updateProduct.amount }
            }
        });
    },
    //Add a product to the cart
    addToCart: (addObj) => {
        return Carts.update({user: addObj.id}, {
            $push: {
                "products": { product: addObj.pid , amount: addObj.amount }
            }
        })
    },
    //Delete product from cart
    removeFromCart: (removeObj) => {
        return Carts.update({user: removeObj.id}, {
            $pull: {
                "products": { product: removeObj.pid }
            }
        });
    },
    //Calculates the price of the cart
    calculateTotalPrice: async(id) => {
        let totalPrice = 0;
        let item = null;
        let product = await Carts.find({user: id});
        for(let i=0;i<product[0].products.length;i++){
            item = await Products.find({_id:product[0].products[i].product})
            totalPrice += product[0].products[i].amount*item[0].price;
        }
        await Carts.update({user: id},{totalPrice: totalPrice})
        return totalPrice;
    },
    //Deleting a cart
    delete: (id) => {
        return Carts.deleteOne({
            _id: id
        });
    }

}