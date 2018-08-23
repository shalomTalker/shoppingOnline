const express = require('express');
const router = express.Router();
module.exports = router;

const cartController = require('../controllers/cart.controller');

// routing
router.get('/create', cartController.createCart);
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);   
router.delete('/:id', cartController.removeFromCart);