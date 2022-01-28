
const express = require('express')
const router = express.Router()
const session = require('express-session')

router.use(session({
    secret: 'Super secret words',
    resave: false,
    saveUninitalized: true
  }))

function logMiddleware(req, res, next) {
    console.log('MIDDLEWARE')
    next()  
}

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

movies = []

router.get('/add-movie', authenticateMiddleware, (req, res) => {
    res.render('add-movie')
})

router.get('/api/movies', (req, res) => {
    res.json(movies)
})

router.post('/add-movie',(req, res) => {
    let{title, description, genre, image} = req.body
    const movie = {movieId: movies.length +1, title: title, description: description, genre: genre, image: image}
    
    movies.push(movie)
    console.log(movie)
    res.redirect('/movies')
})

router.get ('/', authenticateMiddleware, (req, res) => {
    res.render('movies', {allMovies: movies})
})

router.post('/delete-movie',  (req, res) => {
    const movieId = req.query.movieId
    console.log("DELETING")
    movies = movies.filter(movie => movie.movieId != movieId)
    res.redirect('/movies')
})

router.get('/update-movie',  authenticateMiddleware, (req, res) => {
    const movieId=req.query.movieId
    console.log("getting movieId", movieId)
    const movie = movies.filter(movie => movie.movieId == movieId)[0]
    console.log("UPDATE")
    res.render('update-movie', {movie})
})

router.post('/update-movie', (req, res) => {

    let{title, description, genre, image} = req.body
    const index = movies.findIndex((movie)=>{
        return movie.movieId == req.query.movieId
    })

    movies[index] = {title, description, genre, image, movieId: req.query.movieId}

    res.redirect('/movies')
})

router.get('/:movieId', (req, res) =>{
    const movieId =req.params.movieId
    const movie = movies.filter(movie => movie.movieId == movieId)[0]
    console.log("MOVIE DETAILS")
    res.render('movie-details', {movie})
})



module.exports = router