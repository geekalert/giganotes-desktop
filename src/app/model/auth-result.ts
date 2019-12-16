import { AuthResponse } from "./server-responses-models/auth-response";

export class AuthResult {
    success: boolean;
    result: AuthResponse;
    errorCode: number;

    constructor() {
        this.success = true;
    }
}
