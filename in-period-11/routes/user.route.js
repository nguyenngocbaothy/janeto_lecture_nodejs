var router = require('express').Router();
var fs = require('fs');
var path = require('path');
var auth = require('../middle-ware/auth');
var userController = require('../controller/user.controller');

router.get('/', auth.auth(), getUsers);
router.post('/', createUser);
router.put('/:id', auth.auth(), updateUser);

module.exports = router;

function updateUser(req, res, next) {
    var id = req.params.id;
    var user = req.body;
    user._id = id;
    userController.updateUser(user)
        .then(function (user) {
            res.send(user);
        })
        .catch(function (err) {
            next(err);
        })
}

function getUsers(req, res, next) {
    var query = req.query;
    userController.getUsers(query)
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            next(err);
        })
}

function createUser(req, res, next) {
    var newUser = req.body;
    if (!newUser.email) {
        next({
            statusCode: 400,
            message: "Email is required"
        })
    } else if (!newUser.password) {
        next({
            statusCode: 400,
            message: "Password is required"
        })
    } if (!newUser.name) {
        next({
            statusCode: 400,
            message: "Name is required"
        })
    } else {
        userController.createUser(newUser)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (err) {
                next(err);
            })
    }
}