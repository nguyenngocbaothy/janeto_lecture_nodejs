var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        default: 'unknown'
    }
});

userSchema.index({ name: 'text', profession: 'text' });

var user = mongoose.model('user', userSchema);
module.exports = user;