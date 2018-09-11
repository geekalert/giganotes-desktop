import { Injectable } from '@angular/core';
import { Note } from './../model/note';
import { Folder } from './../model/folder';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import * as fs from 'async-file';
import { LoggerService } from './logger-service';
import * as sqlite from 'sqlite';
import { v4 as uuid } from 'uuid';
import { ElectronService } from '../providers/electron.service';
import * as path from 'path';
import { InitialMigration } from './migrations/initial-migration-01';
import { EncryptedNoteMigration } from './migrations/encrypted-note-migration-02';
import { IMigration } from './migrations/base-migration';

@Injectable()
export class DbService {

    dbName = 'local.db'
    private db: sqlite.Database = null;
    migrations : Array<IMigration> = [new InitialMigration(), new EncryptedNoteMigration()]

    constructor(private loggerService: LoggerService, private electronService : ElectronService) {
    }

    async openDatabase() {
        try {
            this.loggerService.info('Connecting to local database');

            const appDataPath = this.electronService.getUserDataPath() + path.sep + this.dbName
            
            this.db = await sqlite.open(appDataPath)

            this.loggerService.info('Connection to local database established');

            await this.runMigrations();

            await this.db.run('PRAGMA foreign_keys=ON')

        } catch (e) {
            console.error(e)
        }
    }    

    async runMigrations() {

        this.loggerService.info('Running migrations');

        const migrationTableExistQuery = await this.all('SELECT DISTINCT tbl_name FROM sqlite_master WHERE tbl_name = ?', ['migrations'])
        const migrationTableExists = migrationTableExistQuery.length != 0

        let lastAppliedMigration = 0
        if (migrationTableExists) {
            const lastAppliedMigrationQuery = await this.all('SELECT MAX(id) as lastAppliedId FROM migrations')
            lastAppliedMigration = lastAppliedMigrationQuery.item(0).lastAppliedId
        }

        // Take migrations that are not appied and sort them by id
        const nonAppliedMigrations = this.migrations.filter(a => a.getId() > lastAppliedMigration)

        if (nonAppliedMigrations.length > 0) {
            nonAppliedMigrations.sort((a,b) => a.getId()- b.getId())

            for (const m of nonAppliedMigrations) {
                try {  
                    await m.up(this)
                    await this.run('INSERT INTO migrations VALUES (?)', [m.getId()])                    
                } catch(e) {
                    await m.down(this)
                }
            }
        }        
    }

    async all(sql: string, params?: any[]): Promise<any> {
        const res = await this.db.all(sql, params)
        res["item"] = function(index) {
            return this[index];
        }
        return res;
    }

    async run(sql: string, params?: any[]): Promise<void> {
        await this.db.run(sql, params)
    }    
}
