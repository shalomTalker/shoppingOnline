const express = require('express');
const router = express.Router();
module.exports = router;
const userController = require('../controllers/users.controller');
//Identifies the token taken from the client
const checkAuth = require('../middlewares/jwt');
// routing
router.post('/login', userController.loginUser);
router.post('/', userController.createUser);
router.get('/', checkAuth, userController.getAllUsers);
router.get('/:id', checkAuth, userController.getUserById);
router.put('/:id', checkAuth, userController.editUser);


