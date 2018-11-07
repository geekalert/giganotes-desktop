import { IMigration } from "./base-migration";
import { DbService } from "../db-service";

export class FavoritesMigration implements IMigration {
    getId() : number {
        return 3
    }

    async up(dbService : DbService): Promise<any> {        
        await dbService.run('CREATE TABLE "favorites" ("noteId" char(36) NOT NULL, "userId" INT NOT NULL);')
    }
    
    async down(dbService : DbService): Promise<any> {        
    }

}