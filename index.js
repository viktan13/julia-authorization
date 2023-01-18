const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store') (session);
const passport = require('passport');

const app = express()
const port = 3000

app.use(express.json()); //парсинг (подключение запросов)
app.use(express.urlencoded({extended: false}));

app.use(
    session({
        secret: 'any word',
        store: new FileStore,
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        },
        resave: false,
        saveUninitialized: false
    })
);

require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user) {
        if(err) {
            return next(err);
        }
        if(!user) {
            return res.send('Enter correct email');
        }
        req.login(user, function (err) {
            if(err) {
                return next(err);
            }

            return res.redirect('/admin');
        });
    })(req, res, next);
})

const auth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/');
    }
}

app.get('/admin', auth, (req, res) => {
    res.send('Admin Page')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})