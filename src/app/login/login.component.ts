import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { AuthService } from '../services/auth-service';
import { LoggerService } from '../services/logger-service';

import { SocialAuthService } from '../services/social-auth/social-auth-service';
import { GoogleLoginProvider } from '../services/social-auth/google-login-provider';
import { LocalNoteService } from '../services/local-note-service';

import { Folder } from './../model/folder';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
    signInModel: any = {};
    registerModel: any = {};
    isLoading = false;
    signInErrorMessage = "";
    registerErrorMessage = "";
    imgPath = 'assets/logo.png';

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private noteService: LocalNoteService,
        private socialAuthService: SocialAuthService,
        private loggerService: LoggerService) {

        const googleIconUrl = sanitizer.bypassSecurityTrustResourceUrl('./assets/google.svg');
        iconRegistry.addSvgIcon('google-colored', googleIconUrl);
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
            const result = await this.authService.loginSocial({ email: user.email, provider: user.provider, token: user.idToken })
            await this.saveFolder(result)
            this.router.navigate(['home']);
        } catch (err) {
            if (err.status === 401) {
                this.signInErrorMessage = "Wrong token provided";
            }

            if (err.status === 0) {
                this.signInErrorMessage = "Cannot connect to server. Please check your connection.";
            }
            this.isLoading = false;
        }

    }


    signInWithGoogle(): void {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(err => {
            this.signInErrorMessage = err.toString()
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
        this.isLoading = true;
        this.signInErrorMessage = "";

        try {
            const result = await this.authService.login({ email: this.signInModel.username, password: this.signInModel.password })
            await this.saveFolder(result)
            this.router.navigate(['home']);
        } catch (err) {
            if (err.status == 401) {
                this.signInErrorMessage = "Incorrect login or password";
            }

            if (err.status == 0) {
                this.signInErrorMessage = "Cannot connect to server. Please check your connection.";
            }
            this.isLoading = false;
        };
    }


    async register() {
        this.isLoading = true;
        this.registerErrorMessage = "";

        try {
            const result = await this.authService.signup({ email: this.registerModel.username, password: this.registerModel.password })

            if (result.error != null) {
                if (result.error == "USER_EXISTS") {
                    this.registerErrorMessage = "User already exists.";
                }
                this.isLoading = false;
            } else {

                const folder = new Folder();
                folder.id = result.rootFolder.id;
                folder.title = result.rootFolder.title;
                folder.parentId = result.rootFolder.parentId;
                folder.level = result.rootFolder.level;
                folder.userId = result.rootFolder.userId;
                folder.createdAt = new Date(result.rootFolder.createdAt)
                folder.updatedAt = new Date(result.rootFolder.updatedAt)

                await this.noteService.uploadFolder(folder)

                this.router.navigate(['home']);
            }

        } catch (err) {
            if (err.status === 401) {
                this.registerErrorMessage = "Incorrect login or password.";
            }

            if (err.status === 0) {
                this.registerErrorMessage = "Cannot connect to server. Please check your connection.";
            }

            this.isLoading = false;
        };
    }

    async doOffline() {
        await this.authService.loginOffline()
        await this.noteService.createRootFolderIfNotExists()
        this.router.navigate(['home'])
        return false;
    }
}
