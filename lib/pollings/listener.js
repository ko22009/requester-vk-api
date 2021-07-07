class Listener {
    listeners = Object.create(null)

    add(event, name, callback) {
        if (!this.listeners[event]) this.listeners[event] = Object.create(null)
        this.listeners[event][name] = callback
    }

    addEvent(name, callback) {
        this.add('message_event', name, callback)
    }

    addCommand(name, callback) {
        this.add('message_new', name, callback)
    }

    remove(event, name) {
        delete this.listeners[event][name]
        if (!Object.keys(this.listeners[event]).length) {
            delete this.listeners[event]
        }
    }

    listen(update) {
        if (!update.type) return
        const listeners = this.listeners[update.type]
        if (!listeners) return;
        let name = update.object.message ? update.object.message.text : ''
        if (update.object.payload) {
            name = update.object.payload.name
        }
        for (const listener in listeners) {
            if (!name.includes(listener)) continue;
            listeners[listener](update)
        }
    }
}

module.exports = Listener
