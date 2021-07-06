const url = 'http://oauth.vk.com/authorize';
const url_token = 'https://oauth.vk.com/access_token';
const url_redirect = process.env.uri + '/' + process.env.redirect_uri;

const axios = require('axios');

module.exports = function (app) {
    app.get('/' + process.env.redirect_uri, (req, res) => {
        const code = req.query.code
        const params = {
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            code: code,
            redirect_uri: url_redirect
        };
        const getParams = new URLSearchParams(params).toString();
        axios.get(`${url_token}?${getParams}`)
            .then(function (response) {
                req.session.access_token = response.data.access_token
                req.session.user_id = response.data.user_id
                req.session.cookie.maxAge = response.data.expires_in * 1000
                res.redirect('/')
            })
            .catch(function (error) {
                res.json('error')
            });
    })
    app.get('/auth', (req, res) => {
        const params = {
            client_id: process.env.client_id,
            redirect_uri: url_redirect,
            response_type: 'code',
            scope: process.env.scope
        };
        const getParams = new URLSearchParams(params).toString();
        res.redirect(url + '?' + getParams);
    })
};


