class ParamsBuilder {
    constructor(params) {
        this.params = params
    }

    toString() {
        return Object.entries(this.params).map(([key, val]) => `${key}=${val}`).join('&')
    }
}

module.exports = ParamsBuilder
