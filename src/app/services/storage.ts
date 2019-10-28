import { Injectable } from '@angular/core';

@Injectable()
export class Storage {


    async get(key: string): Promise<any> {
        return null;
    }

    async set(key: string, value: any): Promise<void> {
    }

    async remove(key: string): Promise<void>  {
    }

    async clear(): Promise<void> {
    }
}
