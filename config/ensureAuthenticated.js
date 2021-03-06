module.exports = function ensureAuthenticated(req, res, next){
    if( req.isAuthenticated() ){
        return next()
    } else {
        req.flash('error_msg', 'Please log in first')
        res.redirect('/users/login')
    }
}