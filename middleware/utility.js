// middleware to ensure iser is logged in
function isLoggedIn(req, res, next) {
    if (req.session.email) {
        return next();
    }
    // if not logged in, redirect to login form
    res.redirect('/login');
}

// export the function
module.exports = {
    isLoggedIn
}