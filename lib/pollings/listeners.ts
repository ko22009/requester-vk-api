import { Listener } from "@/pollings/listener";
import { RequesterVK } from "@/requester-vk";

export function listeners(listener: Listener, requesterVK: RequesterVK) {
  listener.addCommand("/start", function (update) {
    requesterVK.sendMessage({
      peer_id: update.object.message.peer_id,
      message: "test",
    });
  });
  listener.addCommand("photo", function (attachment) {
    const photo = attachment.photo;
    const link = `photo${photo.owner_id}_${photo.id}_${photo.access_key}`;
    requesterVK.sendMessage({
      peer_id: photo.owner_id,
      attachment: link,
    });
  });
  listener.addCommand("/time", function (update) {
    requesterVK.sendMessage({
      peer_id: update.object.message.peer_id,
      message: Date(),
    });
  });
  listener.addCommand("/empty", function (update) {
    const emptyKeyboard = { buttons: [], one_time: true };
    requesterVK.sendMessage({
      peer_id: update.object.message.peer_id,
      message: "empty",
      keyboard: JSON.stringify(emptyKeyboard),
    });
  });
  listener.addCommand("Начать", function (update) {
    const keyboard = {
      inline: false,
      buttons: [
        [
          {
            action: {
              type: "callback",
              payload: '{"name": "register"}',
              label: "register",
            },
            color: "negative",
          },
        ],
      ],
    };
    requesterVK.sendMessage({
      peer_id: update.object.message.peer_id,
      message: "keyboard",
      keyboard: JSON.stringify(keyboard),
    });
  });

  listener.addEvent("register", function (update) {
    requesterVK.sendMessageEvent({
      event_id: update.object.event_id,
      user_id: update.object.user_id,
      peer_id: update.object.peer_id,
      event_data: JSON.stringify({
        type: "show_snackbar",
        text: "Покажи исчезающее сообщение на экране",
      }),
    });
  });
}
