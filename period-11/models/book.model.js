var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'user' 
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

bookSchema.index({description: 'text', title: 'text'});

var Book = mongoose.model('book', bookSchema);

module.exports = Book;