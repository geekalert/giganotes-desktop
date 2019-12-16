import { Folder } from "../folder";

export interface AuthResponse {
    token: string;
    userId: number;
    rootFolder: Folder;
}
