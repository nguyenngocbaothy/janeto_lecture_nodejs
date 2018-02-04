var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var router = express.Router();
var userRouter = require('./routes/user.route');
var authRouter = require('./routes/auth.route');
var errorHandler = require('./middle-ware/error-handler');
var db = require('./db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use(errorHandler.errorHandler());

app.listen(8081, function () {
    console.log("Ung dung Node.js dang lang nghe tai dia chi: http://localhost:8081");
})