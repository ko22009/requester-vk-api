import { Session } from 'express-session'

declare module 'express-session' {
 interface Session {
        access_token: string;
        user_id: number;
  }
}
