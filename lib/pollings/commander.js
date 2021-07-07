class Commander {
    commands = {}

    add(command, callback) {
        this.commands[command] = callback
    }

    remove(command) {
        delete this.commands[command]
    }

    listen(update) {
        if (update.type === 'message_new') {
            for (const command in this.commands) {
                if (!update.object.message.text.includes(command)) continue;
                this.commands[command](update)
            }
        }
    }
}

module.exports = Commander
