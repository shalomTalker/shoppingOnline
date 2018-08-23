const express = require('express');
const router = express.Router();
module.exports = router;
//multer - File upload plugin
const multer = require('multer')
//Identifies the token taken from the client
const checkAuth = require('../middlewares/jwt');

const productsController = require('../controllers/products.controller');

//upload files
let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../uploads'); //image storage path
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, datetimestamp + file.originalname); // 
    }
});

let upload = multer({ //multer settings
    storage: storage
}).single('file');

router.post('/upload', checkAuth, upload, (req, res, next) => {
    if (req.userData.role != 2) {
        res.status(403).end();
    } else {
        try {
            let path = '';
            //Checks if a file name exists
            if (req.file) {
                upload(req, res, (err) => {
                    if (err) {
                        throw "Error occured"
                    }
                    path = req.file.path;
                    res.json(req.file);
                });
            }else{
                throw "Missing file name"
            }
        } catch (e) {
            console.log(e);
            res.status(404).end(e);
        }
    }
});

// routing
router.get('/', productsController.getAll);
router.get('/category', checkAuth, productsController.getAllCategories);
router.post('/category', checkAuth, productsController.addCategory);
router.put('/category/:id', checkAuth, productsController.editCategory);
router.get('/category/:id', checkAuth, productsController.getProductsByCategory);
router.post('/search', checkAuth, productsController.searchProduct);
router.post('/', checkAuth, productsController.addProduct);
router.put('/:id', checkAuth, productsController.updateProduct);
