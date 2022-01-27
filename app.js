const express = require('express')
const app = express() 
const bodyParser = require("body-parser")
const mustacheExpress = require('mustache-express')
const moviesRouter = require('./routes/movies')

 

app.engine('mustache', mustacheExpress('./views' + '/partials', '.mustache'))
app.set('views', './views')

app.use(bodyParser.urlencoded({extended: false}))
app.use('/css', express.static("css")) 
app.use('/movies', moviesRouter)
app.use('/', moviesRouter)
app.set('view engine', 'mustache')



global.movies = [
]

app.get('/api/movies', (req, res) => {
    res.json(movies)
})

app.listen(3000, () => {
    console.log('Server is running...')
})