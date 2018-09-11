import { IMigration } from "./base-migration";
import { DbService } from "../db-service";

export class EncryptedNoteMigration implements IMigration {
    getId() : number {
        return 2
    }

    async up(dbService : DbService): Promise<any> {        
        await dbService.run('ALTER TABLE "note" ADD "encrypted" INTEGER DEFAULT 0')
    }
    
    async down(dbService : DbService): Promise<any> {
        await dbService.run('DROP COLUMN IF EXISTS "encrypted"')
    }

}