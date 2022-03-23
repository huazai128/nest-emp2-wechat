/* eslint-disable @typescript-eslint/no-namespace */
import { ConfigServer } from "./config.interface";


export interface HttpRequest {
    transformUrl: string
    transferData: Record<string, any>
    apiTransferType?: ConfigServer['apiPrefix']
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            isLogin: boolean
        }
       
        interface AuthenticatedRequest extends Request {
            user: User;
        }

        interface UnauthenticatedRequest extends Request {
            user?: undefined;
        }
    }
}

export interface User {
    username: string
    userId: string
}
declare module 'express-session' {
    export interface SessionData {
        user: User
    }
}