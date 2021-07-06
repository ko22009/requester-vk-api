const ParamsBuilder = require('./params-builder');
const FormData = require('form-data');

const axios = require('axios');

class RequestBuilder {
    constructor(url, params) {
        this.url = url;
        this.params = params;
    }

    get() {
        return axios.get(`${this.url}?${new ParamsBuilder(this.params)}`)
    }

    post() {
        const formData = new FormData()
        Object.keys(this.params).forEach((key) => {
            formData.append(key, this.params[key])
        })
        return axios.post(this.url, formData, {
            headers: formData.getHeaders()
        })
    }
}

module.exports = RequestBuilder
