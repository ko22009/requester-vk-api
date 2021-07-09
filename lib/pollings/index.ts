import {Polling} from './polling';

export function polling() {
    const group_id = process.env.group_id as string
    const group_token = process.env.group_token as string
    new Polling(group_id, group_token)
}

