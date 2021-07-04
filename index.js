require('dotenv').config();
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const axios = require('axios');
const app = express()
const port = 80

app.use(session({
    secret: 'keyboard cat',
    store: MongoStore.create({
        mongoUrl: process.env.mondoDB,
    }),
    resave: false,
    saveUninitialized: true
}))

require('./token')(app)

function authorizedMiddleware(req, res, next) {
    if (req.session.access_token) {
        next()
    } else {
        res.send('no token. please go to <a href="/get-token">get-token</a>')
    }
}

function requester(req) {
    const token = req.session.access_token
    const method = req.params.method
    const args = new URLSearchParams(req.query).toString()
    const url = `https://api.vk.com/method/${method}?${args}&access_token=${token}&v=${process.env.version}`
    return axios.get(url)
}

app.get('/request/:method', authorizedMiddleware, (req, res) => {
    requester(req)
        .then((response) => res.json(response.data))
        .catch(function (error) {
            res.json(error)
        });
})

app.get('/', authorizedMiddleware, (req, res) => {
    res.send('example of request to vk: /request/method?params')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
