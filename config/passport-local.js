const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// import user model
const User = require('../models/User')

function authenticateUser(passport) {

    const newLocalStrategy = new LocalStrategy({usernameField: 'email', passwordField: 'password1'}, (email, password1, done) => {
        // check if user exists by using email
        User.findOne({email})
        .then(user => {
            if(!user) {
                return done(null, false, {message: 'Email address is not registered'})
            }

            // check if password matches with email address
            bcrypt.compare(password1, user.password, (error, isMatch) => {
                if(error) throw error
                if( !isMatch ){
                    return done(null, false, {message: 'Password is incorrect'})
                } else {
                    return done(null, user)
                }

            })

        })
        .catch(error => console.log(error))
    })


    passport.use(newLocalStrategy)

    // serialize a user to a session
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // deserialize a user from a session
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user)
        })
    })

}

// export the function
module.exports = authenticateUser