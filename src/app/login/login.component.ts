import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth-service';
import { LoggerService } from '../services/logger-service';

import { SocialAuthService } from '../services/social-auth/social-auth-service';
import { GoogleLoginProvider } from '../services/social-auth/google-login-provider'; 
import { LocalNoteService } from '../services/local-note-service';

import { Folder } from './../model/folder';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    errorMessage = "";
    imgPath='assets/logo.png';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private noteService: LocalNoteService,
        private socialAuthService: SocialAuthService,
        private loggerService: LoggerService) {
    }

    ngOnInit() {
        this.socialAuthService.authState.subscribe((user) => {
            if (user != null) {
                this.onSocialLoginDone(user)
            }
        });
    }

    async onSocialLoginDone(user: any) {
        try {
             const result = await this.authService.loginSocial({email: user.email, provider : user.provider, token: user.idToken})
             await this.saveFolder(result)
             this.router.navigate(['home']);
        } catch (err) {
            if (err.status === 401) {
                this.errorMessage = "Wrong token provided";
            }

            if (err.status === 0) {
                this.errorMessage = "Cannot connect to server. Please check your connection.";
            }
            this.loading = false;
        }

    }


    signInWithGoogle(): void {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(err => {
            console.log('SignIn error')
        })
    }

    async saveFolder(result: any) {
        const folder = new Folder();
        folder.id = result.rootFolder.id;
        folder.title = result.rootFolder.title;
        folder.parentId = result.rootFolder.parentId;
        folder.level = result.rootFolder.level;
        folder.userId = result.rootFolder.userId;
        folder.createdAt = new Date(result.rootFolder.createdAt)
        folder.updatedAt = new Date(result.rootFolder.updatedAt)

        await this.noteService.uploadFolder(folder);
    }

    async login() {
        this.loading = true;
        this.errorMessage = "";

        try {
            const result = await this.authService.login({ email: this.model.username, password: this.model.password })
            await this.saveFolder(result)
            this.router.navigate(['home']);
        } catch (err) {
            if (err.status == 401) {
                this.errorMessage = "Incorrect login or password";
            }

            if (err.status == 0) {
                this.errorMessage = "Cannot connect to server. Please check your connection.";
            }
            this.loading = false;
        };
    }

    async doOffline() {
        await this.authService.loginOffline()
        await this.noteService.createRootFolderIfNotExists()
        this.router.navigate(['home'])
        return false;
    }
}
