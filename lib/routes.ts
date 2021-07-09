import {Application, NextFunction, Request, Response} from 'express';
import {RequesterVKInstance} from '@/requester-vk';

const ParamsBuilder = require('./params-builder');
const RequestBuilder = require('./request-builder');
const RequesterVK = require('./requester-vk');

export function routes (app: Application) {

    function authorizedMiddleware(req: Request, res: Response, next: NextFunction) {
        if (req.session.access_token) {
            next()
        } else {
            res.send('no token. please go to <a href="/auth">auth</a>')
        }
    }
    const host = process.env.host
    const callback_auth = process.env.callback_method
    const redirect_uri = `${host}/${callback_auth}`

    app.get(`/${callback_auth}`, (req, res) => {
        const url = 'https://oauth.vk.com/access_token';
        const code = req.query.code
        const params = {
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            code: code,
            redirect_uri: redirect_uri
        };
        (new RequestBuilder(url, params)).get()
            .then(function (response: { data: any }) {
                req.session.access_token = response.data.access_token
                req.session.user_id = response.data.user_id
                req.session.cookie.maxAge = response.data.expires_in * 1000
                res.redirect('/')
            })
            .catch(function (error: any) {
                res.json(error)
            });
    })

    app.get('/auth', (req, res) => {
        const url = 'http://oauth.vk.com/authorize';
        const params = {
            client_id: process.env.client_id,
            redirect_uri: redirect_uri,
            response_type: 'code',
            scope: process.env.scope
        };
        res.redirect(url + '?' + new ParamsBuilder(params));
    })

    app.get('/request/:method', authorizedMiddleware, (req, res) => {
        (new RequesterVK(req.session.access_token) as RequesterVKInstance)
            .request(req.params.method, req.query)
            .then(response => res.json(response.data))
            .catch(error => res.json(error));
    })

    app.get('/', authorizedMiddleware, (req, res) => {
        res.send('example of request to vk: /request/method?params')
    })
}
