export default class ParamsBuilder {
    private params: object;
    constructor(params: object) {
        this.params = params
    }

    toString() {
        return Object.entries(this.params).map(([key, val]) => `${key}=${val}`).join('&')
    }
}

