const RequestBuilder = require('./request-builder');

class RequesterVK {
    constructor(token) {
        this.token = token
        this.version = process.env.version
    }

    request(method, params) {
        const url = `https://api.vk.com/method/${method}`
        const defaultParams = {
            access_token: this.token,
            v: this.version
        }
        return (new RequestBuilder(url, {...defaultParams, ...params})).post()
    }

    sendMessage(params) {
        return this.request('messages.send', {
            ...params,
            random_id: Date.now() + Math.random()
        })
    }

    sendMessageEvent(params) {
        return this.request('messages.sendMessageEventAnswer', params)
    }
}

module.exports = RequesterVK
