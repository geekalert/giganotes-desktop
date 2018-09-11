import { IMigration } from "./base-migration";
import { DbService } from "../db-service";

export class InitialMigration implements IMigration {
    getId() : number {
        return 1
    }

    async up(dbService : DbService): Promise<any> {
        await dbService.run('CREATE TABLE "folder" ("id" char(36) NOT NULL, "createdAt" INTEGER, "updatedAt" INTEGER, "deletedAt" INTEGER, "title" varchar NOT NULL, "parentId" char(36), "level" INT, "userId" INT, PRIMARY KEY("id"), FOREIGN KEY("parentId") REFERENCES "folder"("id"));')
        await dbService.run('CREATE TABLE "note" ("id" char(36) NOT NULL, "createdAt" INTEGER, "updatedAt" INTEGER, "deletedAt" INTEGER, "title" varchar NOT NULL, "text" text NOT NULL, "folderId" char(36), "level" INT, "userId" INT, PRIMARY KEY("id"), FOREIGN KEY("folderId") REFERENCES "folder"("id"));')
        await dbService.run('CREATE TABLE "props" ("key" char(100) NOT NULL, "value" char(100), PRIMARY KEY("key"));')
        await dbService.run('CREATE TABLE "migrations" ("id" INTEGER NOT NULL, PRIMARY KEY("id"));')
    }
    
    async down(dbService : DbService): Promise<any> {

    }

}