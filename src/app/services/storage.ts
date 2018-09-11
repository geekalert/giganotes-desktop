import { DbService } from "./db-service";
import { Injectable } from '@angular/core';

@Injectable()
export class Storage {

    constructor(private dbService: DbService) {
    }

    async get(key: string): Promise<any> {
        const results = await this.dbService.all('SELECT value FROM props WHERE key = ?', [key])

        if (results.length === 0) {
            return Promise.resolve(null)
        }

        return Promise.resolve(results.item(0).value)
    }

    async set(key: string, value: any): Promise<any> {
        const exists = await this.get(key) != null

        if (exists) {
            await this.dbService.run('UPDATE props SET value = ? WHERE key = ?', [value, key])
        } else {
            await this.dbService.run('INSERT INTO props (key,value) VALUES (?,?)', [key, value])
        }
    }

    async remove(key: string): Promise<any>  {
        await this.dbService.run('DELETE FROM props WHERE key = ?', [key])
    }

    async clear(): Promise<void> {
        await this.dbService.run('DELETE FROM props')
    }
}
