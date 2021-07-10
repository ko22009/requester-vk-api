export class Listener {
  listeners = Object.create(null);

  add(event: string, name: string, callback: (update: any) => void) {
    if (!this.listeners[event]) this.listeners[event] = Object.create(null);
    this.listeners[event][name] = callback;
  }

  addEvent(name: string, callback: (update: any) => void) {
    this.add("message_event", name, callback);
  }

  addCommand(name: string, callback: (update: any) => void) {
    this.add("message_new", name, callback);
  }

  remove(event: string, name: string) {
    delete this.listeners[event][name];
    if (!Object.keys(this.listeners[event]).length) {
      delete this.listeners[event];
    }
  }

  listen(update: any) {
    if (!update.type) return;
    const listeners = this.listeners[update.type];
    if (!listeners) return;
    let name = update.object.message ? update.object.message.text : "";
    if (update.object.payload) {
      name = update.object.payload.name;
    }
    if (listeners[name] instanceof Function) {
      listeners[name](update);
    }
    if (update.object.message && update.object.message.attachments) {
      update.object.message.attachments.forEach((attachment: any) => {
        if (listeners[attachment.type] instanceof Function) {
          listeners[attachment.type](attachment);
        }
      });
    }
  }
}
