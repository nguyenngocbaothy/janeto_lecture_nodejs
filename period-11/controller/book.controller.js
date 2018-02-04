var Book = require('../models/book.model');
var User = require('../models/user.model');
var mongoose = require('mongoose');

module.exports = {
    getBooks: getBooks,
    createBook: createBook,
    updateBook: updateBook
}

function updateBook(book) {
    return Book.findByIdAndUpdate(book._id, book)
        .then(function (book) {
            return Promise.resolve(book);
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

function getBooks(q) {
    var query = {};
    if (q.search) {
        query['$text'] = { $search: q.search };
    }
    return Book.find(query)
        .populate({ path: 'author', select: 'name email' })
        .then(function (books) {
            return Promise.resolve(books);
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

function createBook(newBook) {
    var book = new Book(newBook);

    return book.save()
        .then(function (book) {
            return User.findById(book.author)
                .then(function (user) {
                    user.books.push(book._id);

                    return user.save()
                        .then(function () {
                            return Promise.resolve(book);
                        })
                })
        })
        .catch(function (err) {
            return Promise.reject(err);
        })
}

