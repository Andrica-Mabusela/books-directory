const express = require('express')
const router = express.Router()

// load the book model
const Book = require('../models/Book')

// ensureAutheticated middleware
const ensureAuthenticated = require('../config/ensureAuthenticated')

router.get('/books', (req, res) => {
    Book.find({})
    .then(books => {
        if(books.length > 0) {
           let username = typeof req.user == 'undefined' ? ' ' : req.user.username
           return res.render('home', {books: books, username: username })
        } 
        const myBooks = {
            title: 'No Books Available',
            author: '',
            status: ''
        }
        let username = typeof req.user == 'undefined' ? ' ' : req.user.username
        res.render('home', {books: myBooks, username: username })
    })
    .catch(error => console.log(error))
})



router.get('/books/add-book', ensureAuthenticated, (req, res) => {
    console.log('rendering')
    let username = typeof req.user == 'undefined' ? ' ' : req.user.username
    res.render('add-book', {username: username })  
})

router.get('/books/:id', (req, res) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book) {
            let username = typeof req.user == 'undefined' ? ' ' : req.user.username
            res.render('edit-book', {book: book, username: username})
        }
    })
    .catch(error => console.log(error))
})


router.put('/books/:id', (req, res) => {

    const { title, author, status } = req.body

    Book.findOne({_id: req.params.id})
    .then(book => {
        console.log('then')
        if(book) {
            console.log('book exists')
            Book.findOneAndUpdate({_id: book._id}, {title, author, status}, {useFindAndModify: false})
            .then(myBook => {
                console.log('book updated')
                
                res.redirect('/books')
            })
            .catch(error => console.log(error))
        }

    })
    .catch(error => console.log(error))
})

router.post('/books/add-book', (req, res) => {
    Book.create(req.body)
    .then( book => {
       res.redirect('/books')
    })
    .catch(error => console.log(error))

})


router.delete('/books/:id', (req, res) => {
    Book.findOneAndRemove({_id: req.params.id}, {useFindAndModify: false})
    .then(book => {
        console.log('book is removed')
        res.redirect('/books')
    })
    .catch(error => console.log(error))
})




module.exports = router