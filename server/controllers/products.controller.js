const productsModel = require('../models/products.model');
const fs = require('fs');

module.exports = {
    //categories methods
    getAllCategories: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                //Takes from the model all categories  and sent to the client side
                let categorys = await productsModel.getAllCategories();
                res.json(categorys);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    addCategory: async (req, res) => {
        if (req.userData.role != 2) {
            res.status(403).end();
        } else {
            try {
                let categoryObj = {
                    name: req.body.name
                }
                //Checks in database that there is no category with this name
                let categories = await productsModel.getAllCategories();
                for (let c of categories) {
                    if (c.name == categoryObj.name) {
                        throw "Category name exists"
                    };
                }
                //Adding a category
                let category = await productsModel.addCategory(categoryObj);
                res.json(category);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    editCategory: async (req, res) => {
        if (req.userData.role != 2) {
            res.status(403).end();
        } else {
            try {
                let categoryID = req.params.id;
                let categoryObj = {
                    name: req.body.name
                }
                //Checks in database that there is no category with this name
                let categories = await productsModel.getAllCategories();
                for (let c of categories) {
                    if (c.name == categoryObj.name) {
                        throw "Category name exists"
                    };
                }
                //Updating category name
                let category = await productsModel.updateCategory(categoryID, categoryObj);
                res.json(category);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    //products methods
    getAll: async (req, res) => {
        try {
            //Takes from the model all products and sent to the client side
            let products = await productsModel.getAll();
            res.json(products);
        } catch (e) {
            console.log(e);
            res.status(400).end(e);
        }
    },
    addProduct: async (req, res) => {
        if (req.userData.role != 2) {
            res.status(403).end();
        } else {
            try {
                let addObj = {
                    name: req.body.name,
                    category: req.body.category,
                    price: req.body.price,
                    image: req.body.image,
                    kg: req.body.kg
                }
                //Checks that there is no data missing
                if (!addObj.name || !addObj.category || !addObj.price || !addObj.image) {
                    throw "Add product missing details";
                }
                //Checks that the price is not below zero
                if (addObj.price <= 0) {
                    throw "Negative number can not be used";
                }
                //Check if product exists in the cart
                if (await productsModel.byName(addObj.name)) {
                    throw "Product exists";
                }
                //Adding a new product
                let newProduct = await productsModel.create(addObj);
                res.json(newProduct);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    updateProduct: async (req, res) => {
        let id = req.params.id;
        if (req.userData.role != 2) {
            res.status(403).end();
        } else {
            try {
                //Takes, and makes sure that there is, the product that is now updated
                let product = await productsModel.byId(id);
                if (!product) {
                    throw `Product id not found ${id}`;
                }
                //If the user uploads a new image, the previous image is deleted
                if (req.body.image !== undefined) {
                    fs.unlink(`../uploads/${product.image}`, (err) => {
                        //console.log(err);
                    })
                }
                //If one of the data does not arrive from the user, it uses data that was previously in a database
                let updateObj = {
                    name: req.body.name ? req.body.name : product.name,
                    category: req.body.category ? req.body.category : product.category._id,
                    price: req.body.price ? req.body.price : product.price,
                    image: req.body.image ? req.body.image : product.image,
                    kg: req.body.kg
                }
                //Checking for a product with this name
                if (product.name != updateObj.name) {
                    let name = await productsModel.byName(updateObj.name);
                    if (name) {
                        throw "Product exists";
                    }
                }
                //Updating product
                let updateProduct = await productsModel.update(id, updateObj);
                res.json(updateProduct);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    // deleteProduct: async (req, res) => {
    //     if (req.userData.role != 2) {
    //         res.status(403).end();
    //     } else {
    //         try {
    //             let productDeleted = await productsModel.deleteProduct(req.params.id);
    //             if (productDeleted.n != 1) {
    //                 throw "Product doesnt exist";
    //             }
    //             res.json(true);
    //         } catch (e) {
    //             console.log(e);
    //             res.status(400).end(e);
    //         }
    //     }
    // },
    searchProduct: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                //Looking for a product
                let foundProducts = await productsModel.search(req.body.search);
                //If the array is less than 1 then an error returns
                if (foundProducts.length < 1) {
                    res.status(200).end(false);
                }
                res.json(foundProducts);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    getProductsByCategory: async (req, res) => {
        if (req.userData.role < 1) {
            res.status(403).end();
        } else {
            try {
                //Returns products by category
                let products = await productsModel.byCategory(req.params.id);
                res.json(products);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    }

}