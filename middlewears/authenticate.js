
 
function authenticateMiddleware(req, res, next) {

    if(req.session) {
        if(req.session.username) {
            next() 
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }

}

module.exports=authenticateMiddleware
