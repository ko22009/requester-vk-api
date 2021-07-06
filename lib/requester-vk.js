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
        return (new RequestBuilder(url, {...defaultParams, ...params}))
    }
}

module.exports = RequesterVK
