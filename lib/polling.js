const RequesterVK = require('./requester-vk');
const RequestBuilder = require('./request-builder');

class Polling {

    constructor(group_id, group_token) {
        this.group_id = group_id
        this.group_token = group_token
        this.requesterVK = new RequesterVK(group_token)
        this.start()
    }

    start() {
        this.requesterVK.request('groups.getLongPollServer', {
            group_id: this.group_id
        }).post()
            .then(response => {
                this.poll(response.data.response)
            })
            .catch(error => console.log(error));
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
            response.data.updates.forEach(update => {
                if (update.type === 'message_new') {
                    this.requesterVK.request('messages.send', {
                        peer_id: update.object.message.peer_id,
                        message: 'test',
                        random_id: Date.now() + Math.random()
                    }).get()
                        .then(response => {
                            console.log(response.data)
                        })
                        .catch(error => console.log(error));
                }
            })
            this.poll({server, key, ts: response.data.ts})
        }).catch(error => console.log(error))
    }
}

module.exports = Polling
