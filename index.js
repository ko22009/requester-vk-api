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

function requester(method, params, token) {
    const args = new URLSearchParams(params).toString()
    const url = `https://api.vk.com/method/${method}?${args}&access_token=${token}&v=${process.env.version}`
    return axios.get(url)
}

app.get('/request/:method', authorizedMiddleware, (req, res) => {
    requester(req.params.method, req.query, req.session.access_token)
        .then(response => res.json(response.data))
        .catch(error => res.json(error));
})

let group;

requester('groups.getLongPollServer', {
    group_id: process.env.group_id
}, process.env.group_token)
    .then(response => {
        group = response.data.response
        console.log(group)
        pooling(response.data.response)
    })
    .catch(error => console.log(error));

function pooling({server, key, ts}) {
    const url = `${server}?act=a_check&key=${key}&ts=${ts}&wait=25`
    console.log('start pooling')
    axios.get(url).then(response => {
        group.ts = response.data.ts
        response.data.updates.forEach(update => {
            if (update.type === 'message_new') {
                console.log(update.object.message)
                requester('messages.send', {
                    peer_id: update.object.message.peer_id,
                    message: 'test',
                    random_id: Date.now() + Math.random()
                }, process.env.group_token)
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => console.log(error));
            }
        })
        pooling(group);
    }).catch(error => {
        console.log(error)
    })
}

app.get('/', authorizedMiddleware, (req, res) => {
    res.send('example of request to vk: /request/method?params')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
