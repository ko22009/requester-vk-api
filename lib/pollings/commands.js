function commands(listener, requesterVK) {
    listener.add('/start', function (update) {
        requesterVK.request('messages.send', {
            peer_id: update.object.message.peer_id,
            message: 'test',
            random_id: Date.now() + Math.random()
        }).then(response => {
            console.log(response.data)
        }).catch(error => console.log(error));
    })
    listener.add('/time', function (update) {
        requesterVK.request('messages.send', {
            peer_id: update.object.message.peer_id,
            message: Date(),
            random_id: Date.now() + Math.random()
        }).then(response => {
            console.log(response.data)
        }).catch(error => console.log(error));
    })
}

module.exports = commands
