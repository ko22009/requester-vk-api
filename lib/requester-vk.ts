import {AxiosResponse} from 'axios';

import {RequestBuilder} from './request-builder';

export class RequesterVK {
    private readonly token: string;
    private readonly version: string | undefined;

    constructor(token: string) {
        this.token = token
        this.version = process.env.version
    }

    request<T = any, R = AxiosResponse<T>>(method: string, params: object): Promise<R> {
        const url = `https://api.vk.com/method/${method}`
        const defaultParams = {
            access_token: this.token,
            v: this.version
        }
        return (new RequestBuilder(url, {...defaultParams, ...params})).post()
    }

    sendMessage(params: object) {
        return this.request('messages.send', {
            ...params,
            random_id: Date.now() + Math.random()
        })
    }

    sendMessageEvent(params: object) {
        return this.request('messages.sendMessageEventAnswer', params)
    }
}

