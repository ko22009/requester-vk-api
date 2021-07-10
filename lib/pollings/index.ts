import { Polling } from "./polling";

export function polling() {
  const group_id = process.env.group_id;
  const group_token = process.env.group_token;
  new Polling(group_id, group_token);
}
