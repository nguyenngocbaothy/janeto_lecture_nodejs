var User = require('../models/user.model');
var crypto = require('crypto');
var secret = 'meomeomeo';

module.exports = {
    getUsers: getUsers,
    createUser: createUser,
    updateUser: updateUser
}

function updateUser(user) {
    return User.findByIdAndUpdate(user._id, user)
        .then(function (user) {
            return Promise.resolve(user);
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

function getUsers() {
    return User.find({}, { password: 0 })
        .populate({
            path: 'books',
            select: 'title -_id',
            populate: {
                path: 'author',
                select: 'name email -_id'
            }
        })
        .then(function (users) {
            return Promise.resolve(users);
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

function createUser(newUser) {
    return User.find({ email: newUser.email })
        .then(function (foundUsers) {
            if (foundUsers.length > 0) {
                return Promise.reject({
                    statusCode: 400,
                    message: 'Email is existed'
                });
            } else {
                var hash = crypto.createHmac('sha256', secret)
                    .update(newUser.password)
                    .digest('hex');

                newUser.password = hash;
                var user = new User(newUser);

                return user.save()
                    .then(function (user) {
                        return Promise.resolve(user);
                    })
                    .catch(function (err) {
                        return Promise.reject(err);
                    })
            }
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

