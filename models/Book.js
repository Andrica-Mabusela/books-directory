const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }

})

// model
const Book = mongoose.model('book', BookSchema)

module.exports = Book