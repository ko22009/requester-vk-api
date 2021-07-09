require('dotenv').config();
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const {routes} = require('./routes')
const {polling} = require('./pollings')
const app = express()

app.use(session({
    secret: 'keyboard cat',
    store: MongoStore.create({
        mongoUrl: process.env.mondoDB,
    }),
    resave: false,
    saveUninitialized: true
}))
routes(app)
polling()

app.listen(80, () => {
    console.log(`Example app listening at http://localhost`)
})

