const express = require('express');
const router = express.Router();
module.exports = router;

const orderController = require('../controllers/order.controller');
//Identifies the token taken from the client
const checkAuth = require('../middlewares/jwt');
// routing
router.get('/ordersCount', orderController.getNumberOfOrders);
router.get('/dates',checkAuth,orderController.getAllShippingDates);
router.get('/:id',checkAuth, orderController.getOrder);
router.get('/', checkAuth, orderController.getAll);
router.post('/',checkAuth, orderController.createOrder);