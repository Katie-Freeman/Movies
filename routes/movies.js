
const express = require('express')
const router = express.Router()
const session = require('express-session')
const authenticateMiddleware = require('../middlewears/authenticate')

router.use(session({
    secret: 'Super secret words',
    resave: false,
    saveUninitalized: true
  }))

movies = []

router.get('/add-movie', authenticateMiddleware, (req, res) => {
    res.render('add-movie')
})

router.get('/api/movies', (req, res) => {
    res.json(movies)
})

router.post('/add-movie',(req, res) => {
    let{title, description, genre, image} = req.body
    const movie = {movieId: movies.length +1, title: title, description: description, genre: genre, image: image, userId: req.session.userId}
    db.none('INSERT INTO movies(movie_title, movie_description, genre, image_url) VALUES($1, $2, $3, $4)',[title, description, genre, image])
    .then(() => {
        res.redirect('/movies')
})

router.get ('/', authenticateMiddleware, (req, res) => {
    const userMovies = movies.filter(movie => movie.username === req.session.username)
    db.one('SELECT movie_title, movie_description, genre, image_url FROM movies')
    .then(() => {
        res.render('movies', {allMovies: userMovies}) 
    })
})

router.post('/delete-movie',  (req, res) => {
    const movieId = req.query.movieId
    db.one('DELETE FROM movies WHERE movie_id = $1 []')
    .then(() => {
        res.redirect('/movies')
    })
    
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

router.get('/:movieId', authenticateMiddleware, (req, res) =>{
    const movieId =req.params.movieId
    const movie = movies.filter(movie => movie.movieId == movieId)[0]
    console.log("MOVIE DETAILS")
    res.render('movie-details', {movie})
})



module.exports = router