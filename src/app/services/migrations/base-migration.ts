import { DbService } from "../db-service";

export interface IMigration {
    getId(): number;   
    up(dbService : DbService): Promise<any>;
    down(dbService : DbService): Promise<any>;
  }
  