const express = require('express')
const app = express() 
const bodyParser = require("body-parser")
const mustacheExpress = require('mustache-express')
const moviesRouter = require('./routes/movies')
const session = require('express-session')

app.use(session({
    secret: 'Super secret words',
    resave: false,
    saveUninitalized: true
  }))

app.engine('mustache', mustacheExpress('./views' + '/partials', '.mustache'))
app.set('views', './views')

app.use(bodyParser.urlencoded({extended: false}))
app.use('/css', express.static("css")) 
app.use('/movies', moviesRouter)
app.set('view engine', 'mustache')



global.movies = []
global.users = []

function logMiddleware(req, res, next) {
    console.log('MIDDLEWARE')
    next() // continue with the original request 
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



app.get('/api/users', (req, res) => {
    res.json(users)
})

app.get('/profile', authenticateMiddleware ,(req, res) => {
    res.send('PROFILE')
})

app.get('/dashboard', authenticateMiddleware, (req, res) => {
    res.render('dashboard')
})

app.get('/add-user',(req,res) => {

    res.render('add-user')
  })

 
  app.post('/add-user',(req,res) => {

    let username = req.body.username
    let password = req.body.password
    let userId = users.length +1
    console.log("Getting User name", {username, password})
    users.push({username, password, userId})
    
    res.redirect('/')
  })

app.post('/login', (req, res) => {
    
    // get username from body 
    const username = req.body.username 
    // get password from body 
    const password = req.body.password 

    const persistedUser = users.find(user => {
        return user.username == username && user.password == password
    })

    if(persistedUser) {
         // if username and password are matching 
        if(req.session) {
            req.session.username = persistedUser.username 
        }
        res.redirect('/movies/add-movie')
    } else {
        res.render('index', {errorMessage: 'Username or password is invalid!'})
    }
})


app.get('/',(req,res) => {
    res.render('index')
  })


app.listen(3000, () => {
    console.log('Server is running...')
})

