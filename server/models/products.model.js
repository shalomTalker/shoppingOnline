const Products = require('./schemas/products.schema');
const Category = require('./schemas/categorys.schema')

module.exports = {
    //categories
    //Takes all category names
    getAllCategories: () =>{
        return Category.find({})
    },
    //Adding a category
    addCategory: (categoryObj) =>{
        let c = new Category(categoryObj);
        return c.save()
    },
    //Updating category name
    updateCategory: (id, categoryObj)=> {
        let newCategory = new Category(categoryObj);
        newCategory._id = id;
        return Category.updateOne({_id:id},newCategory)
    },
    //products
    //Takes all products
    getAll: () =>{
        return Products.find({}).populate('category');
    },
    //Adding a new product
    create: (ProductObj) => {
        let Product = new Products(ProductObj);
        return Product.save()
    },
    //Find products by category
    byCategory: (cid) => {
        return Products.find({category: cid})
            .populate('category');
    },
    //Find products by id
    byId: (id) => {
        return Products.findOne({_id: id})
        .populate('category');
    }, 
    //Find products by name
    byName: (name) => {
        return Products.findOne({
            name: name
        });
    },
    //Search for products by some of the letters of the word
    search: (string) => {
        return Products.find({ name: {$regex: string, $options: "$i"}}).populate('category');
    },
    //Update product in store
    update: (id, productObj) => {
        let Product = new Products(productObj);
        Product._id = id;
        return Products.updateOne({_id: id}, Product);
    }

}