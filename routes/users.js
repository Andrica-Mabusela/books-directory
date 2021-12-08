const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

// register page request handle
router.get('/register', (req, res) => {
    res.render('register')
})

// login page request handle
router.get('/login', (req, res) => {
    res.render('login')
})

// accounts page request handle
router.get('/accounts', (req, res) => {
    res.render('accounts')
})


router.post('/register', (req, res) => {
    const { username, email, password1, password2 } = req.body
    const errors = []

    console.log(req.body)

    // check that all fields are entered
    if( !username || !email || !password1 || !password2 ){
        errors.push({msg: 'All fields are required'})
    }

    // check that password1 is at least 8 characters
    if( password1.length <= 8 ){
        console.log('password length is', password1.length)
        errors.push({msg: 'Password must be at least 8 characters'})
    }

    // check for password match
    if( password1 !== password2 ) {
        errors.push({msg: 'Passwords do not match!!!'})
    }

    if( errors.length > 0 ) { // there are errors
        console.log(errors)
        res.render('register', {
            username, email, password1, password2, errors
        })

    } else { // there are no errors
        // check if email is already registered
        User.findOne({email: email})
        .then(user => {
            if(user) {
                errors.push({msg: 'Email is already registered'})
                res.render('register', {username, email, password1, password2, errors})
            } else {
                // create a new user
                const newUser = new User({
                    username: username,
                    email: email,
                    password: password1
                })

                // hash the user's password
                bcrypt.genSalt(10, (error, salt) => {
                    if(error) {
                        throw error
                    } else {

                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            // set the newUser password to the hash
                            newUser.password = hash

                            // now save the new user
                            newUser.save()
                            .then(user => {
                                console.log(user)
                                req.flash('success_msg', 'You have registered successfully, please log in')
                                res.redirect('/users/login')
                            })
                            .catch(error => console.log(error))

                        })
                    }

                })

            }

        })
        .catch(error => console.log(error))
    }
})



// login post request handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/books',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})


// logout handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You have successfully logged out')
    res.redirect('/books')
})


// export the router
module.exports = router