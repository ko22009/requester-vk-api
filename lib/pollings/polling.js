const RequesterVK = require('./../requester-vk');
const RequestBuilder = require('./../request-builder');
const Listener = require('./listener');

class Polling {
    constructor(group_id, group_token) {
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
            require('./listeners')(this.listener, this.requesterVK)
            this.poll(response.data.response)
        }).catch(error => console.log(error));
    }

    poll({server, key, ts}) {
        const params = {
            act: 'a_check',
            key: key,
            ts: ts,
            wait: 25
        }
        const httpBuilder = new RequestBuilder(server, params)
        httpBuilder.get().then(response => {
            console.log(response.data.updates)
            response.data.updates.forEach(update => this.listener.listen(update))
            this.poll({server, key, ts: response.data.ts})
        }).catch(error => console.log(error))
    }
}

module.exports = Polling
