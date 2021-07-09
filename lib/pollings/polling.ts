import {RequesterVKInstance} from '@/requester-vk';
import {RequestBuilderInstance} from '@/request-builder';

const {RequesterVK} = require('./../requester-vk');
const {RequestBuilder} = require('./../request-builder');
const {Listener} = require('./listener');
const {listeners} = require('./listeners')

type getLongPollServer = {
    server: string,
    key: string,
    ts: number
}

export class Polling {
    private group_id: string;
    private group_token: string;
    private requesterVK: RequesterVKInstance;
    private listener: InstanceType<typeof Listener>;

    constructor(group_id: string, group_token: string) {
        this.group_id = group_id
        this.group_token = group_token
        this.requesterVK = new RequesterVK(group_token)
        this.listener = new Listener()
        this.start()
    }

    start() {
        this.requesterVK.request('groups.getLongPollServer', {
            group_id: this.group_id
        }).then(response => {
            listeners(this.listener, this.requesterVK)
            this.poll(response.data.response)
        }).catch(error => console.log(error));
    }

    poll({server, key, ts}: getLongPollServer) {
        const params = {
            act: 'a_check',
            key: key,
            ts: ts,
            wait: 25
        }
        const httpBuilder: RequestBuilderInstance = new RequestBuilder(server, params)
        httpBuilder.get().then(response => {
            response.data.updates.forEach((update: any) => {
                this.listener.listen(update)
            })
            this.poll({server, key, ts: response.data.ts})
        }).catch(error => console.log(error))
    }
}

