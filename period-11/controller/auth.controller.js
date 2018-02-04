var User = require('../models/user.model');
var crypto = require('crypto');
var jwt = require('../utils/jwt');
var secret = 'meomeomeo';

module.exports = {
    login: login,
    checkAuth: checkAuth
}

function login(email, password) {
    var hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');

    return User.findOne({
        email: email,
        password: hash
    })
        .then(function (user) {
            if (user) {
                return new Promise(function (resolve, reject) {
                    jwt.sign({
                        email: user.email
                    }, function (err, token) {
                        if (err) {
                            reject({
                                statusCode: 400,
                                message: err.message
                            });
                        } else {
                            resolve(token);
                        }
                    })
                });

            } else {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Email or password is incorrect'
                });
            }
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

function checkAuth(user) {
    return User.findOne(user)
        .then(function (foundUser) {
            if (foundUser) {
                return Promise.resolve(foundUser);
            } else {
                return Promise.reject({
                    message: 'Not Found'
                });
            }
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}