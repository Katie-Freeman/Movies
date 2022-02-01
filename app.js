const express = require('express')
const { redirect } = require('express/lib/response')
const pgp = require('pg-promise')()
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const authenticateMiddleware = require('./middlewears/authenticate')

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)

// const PORT = process.env.PORT || 8000

io.on('connection', (socket) => {
    console.log('User is connected')
    

    socket.on('Houston', (chat) => {
        console.log(chat)
        io.emit('Houston',(chat))
    })
})


const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const moviesRouter = require('./routes/movies')


global.movies = []
global.users = []

app.use(session({
    secret: 'Super secret words',
    resave: false,
    saveUninitalized: true
  }))

app.engine('mustache', mustacheExpress('./views' + '/partials', '.mustache'))
app.set('views', './views')
app.set('view engine', 'mustache')
const connectionString = 'postgres://lfjthgno:fYgJ7KdxwdYefpdCFK586F6XZW1cilv7@castor.db.elephantsql.com/lfjthgno'

const db = pgp(connectionString)
app.get('/',(req,res) => {
    res.render('index')
  })

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use('/css', express.static("css")) 
app.use(express.static("public"))
app.use('/movies', moviesRouter)

app.get('/chat', authenticateMiddleware, (req, res) => {
    req.cookies.username = req.session.username
    res.sendFile(__dirname + '/chat.html')
})

app.get('/api/users', (req, res) => {
    res.json(users)
})

app.get('/profile', authenticateMiddleware ,(req, res) => {
    let username = ''
    if(req.session) {
        username = req.session.username
    }
    res.send(`Username is ${username}`)
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
    const userId = req.body.userId 
    // get password from body 
    const password = req.body.password 

    const persistedUser = users.find(user => {
        return user.userId == userId && user.password == password
    })
     
    /* select one user by id */
    const user = db.oneOrNone('SELECT * FROM users WHERE user_id = $1 LIMIT 1', userId, a => !!a);

    if(persistedUser) {
         // if username and password are matching 
        if(req.session) { 
            req.session.userId = persistedUser.userId
        }
        res.redirect('/movies/add-movie')
    } else {
        res.render('index', {errorMessage: 'Username or password is invalid!'})
    }
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')  
})


http.listen(3000, () => {
    console.log('Server is running...')
})





