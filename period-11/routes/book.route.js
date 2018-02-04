var router = require('express').Router();
var fs = require('fs');
var path = require('path');
var auth = require('../middle-ware/auth');
var bookController = require('../controller/book.controller');

router.get('/', auth.auth(), getBooks);
router.post('/', auth.auth(), createBook);
router.put('/:id', auth.auth(), updateBook);

module.exports = router;

function updateBook(req, res, next) {
    var id = req.params.id;
    var book = req.body;
    book._id = id;
    bookController.updateBook(book)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            next(err);
        })
}

function getBooks(req, res, next) {
    bookController.getBooks(req.query)
        .then(function (books) {
            res.send(books);
        })
        .catch(function (err) {
            next(err);
        })
}

function createBook(req, res, next) {
    var newBook = req.body;
    if (!newBook.author) {
        next({
            statusCode: 400,
            message: "Author is required"
        })
    } else if (!newBook.title) {
        next({
            statusCode: 400,
            message: "Title is required"
        })
    } else {
        bookController.createBook(newBook)
            .then(function (data) {
                res.json(data);
            })
            .catch(function (err) {
                next(err);
            })
    }
}