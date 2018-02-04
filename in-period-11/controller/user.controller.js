var User = require('../models/user.model');
var crypto = require('crypto');
var secret = 'meomeomeo';

module.exports = {
    getUsers: getUsers,
    createUser: createUser,
    updateUser: updateUser
}

function updateUser(user) {
    return User.update({ _id: user._id }, user)
        .then(function (raw) {
            return Promise.resolve(user);
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

function getUsers(query) {
    var q = {};
    var sort = {};
    if (query.search) {
        q['$text'] = { $search: query.search, $caseSensitive: false }
    }

    for (var p in query) {
        if (p != 'page' && p != 'perPage' && p != 'search') {
            sort[p] = parseInt(query[p]);
        }
    }

    return User.find(q, { password: 0 })
        .limit(parseInt(query.perPage))
        .skip(parseInt(query.perPage) * (parseInt(query.page) - 1))
        .sort(sort)
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

