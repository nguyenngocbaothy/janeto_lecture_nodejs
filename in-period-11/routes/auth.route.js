var router = require('express').Router();
var authController = require('../controller/auth.controller');

router.post('/login', login);

module.exports = router;

function login(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email) {
        next({
            statusCode: 400,
            message: "Email is required"
        })
    } else if (!password) {
        next({
            statusCode: 400,
            message: "Password is required"
        })
    } else {
        authController.login(email, password)
            .then(function (token) {
                res.send(token)
            })
            .catch(function (err) {
                next(err);
            })
    }
}