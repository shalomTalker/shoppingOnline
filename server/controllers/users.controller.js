const usersModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
const pwd = require('../services/bcrypt');

module.exports = {
    loginUser: async (req, res) => {
        try {
            let result = {
                token: null
            }
            //Checks that there is a user with this email
            let foundUser = await usersModel.byEmail(req.body.email);
            if (foundUser) {
                //Make sure the password matches a database password
                let verifiedPwd = await pwd.verify(req.body.password, foundUser.hash);
                if (verifiedPwd) {
                    result.user = {
                        id: foundUser._id,
                        name: foundUser.firstName + ' ' + foundUser.lastName,
                        level: foundUser.role
                    }
                    //Create a token
                    result.token = jwt.sign(
                        result.user,
                        process.env.JWT_KEY, {
                            expiresIn: "8h"
                        }
                    );
                }
            }
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(400).end(e);
        }
    },

    createUser: async (req, res) => {
        try {
            let createObj = {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                city: req.body.city,
                street: req.body.street,
                role: 1
            }
            //Checks that there is no data missing
            if (!createObj.email || !req.body.password || !createObj.firstName || !createObj.lastName || !createObj.city || !createObj.street) {
                throw "Create user missing details";
            }
            //Checks that the email does not exist in a database
            if (await usersModel.byEmail(createObj.email) != null) {
                throw "User email exists";
            }
            //Encrypts the password
            createObj.hash = await pwd.hash(req.body.password);
            let newUser = await usersModel.create(createObj);
            let result = {
                user: {
                    id: newUser._id,
                    name: newUser.firstName + ' ' + newUser.lastName,
                    level: newUser.role
                }
            }
            //Create a token
            result.token = jwt.sign(
                result.user,
                process.env.JWT_KEY, {
                    expiresIn: "8h"
                }
            );
            res.json(result);
        } catch (e) {
            console.log(e);
            res.status(400).end(e);
        }
    },

    getAllUsers: async (req, res) => {
        if (req.userData.role != 2) {
            res.status(403).end();
        } else {
            try {
                //Returns all users are in a database
                let users = await usersModel.all();
                res.json(users);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    getUserById: async (req, res) => {
        let id = req.params.id;
        if (req.userData.role != 2 && req.userData.id != id) {
            res.status(403).end();
        } else {
            try {
                //Returns user by id
                let user = await usersModel.byId(id);
                user = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    street: user.street,
                    city: user.city,
                    level: user.role,
                    orders: user.orders
                }
                res.json(user);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    },
    editUser: async (req, res) => {
        let id = req.params.id;
        if (req.userData.role != 2 && req.userData.id != id) {
            res.status(403).end();
        } else {
            try {
                //Make sure there is a user
                let user = await usersModel.byId(id);
                if (!user) {
                    throw `User id not found ${id}`;
                }
                //A data that was not reached by client side, uses what was in the database
                let updateObj = {
                    email: req.body.email ? req.body.email : user.email,
                    firstName: req.body.firstName ? req.body.firstName : user.firstName,
                    lastName: req.body.lastName ? req.body.lastName : user.lastName,
                    street: req.body.street ? req.body.street : user.street,
                    city: req.body.city ? req.body.city : user.city,
                    orders: user.orders
                }
                //Checks that the email is not in use
                if (user.email != updateObj.email) {
                    if (await usersModel.byEmail(updateObj.email) != null) {
                        throw "Email taken";
                    }
                }
                //If a password is changed, it encrypts it
                if (req.body.password) {
                    let hash = await pwd.hash(req.body.password);
                    updateObj.hash = hash;
                }
                //Updating the user in a database
                await usersModel.update(id, updateObj);
                let result = {
                    user: {
                        id: id,
                        name: updateObj.firstName + ' ' + updateObj.lastName,
                        level: user.role
                    }
                }
                //Create a token
                result.token = jwt.sign(
                    result.user,
                    process.env.JWT_KEY, {
                        expiresIn: "8h"
                    }
                );
                res.json(result);
            } catch (e) {
                console.log(e);
                res.status(400).end(e);
            }
        }
    }
}