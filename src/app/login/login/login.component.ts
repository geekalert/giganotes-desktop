import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { AuthService } from '../../services/auth-service';
import { LoggerService } from '../../services/logger-service';
import { SocialAuthService } from '../../services/social-auth/social-auth-service';
import { GoogleLoginProvider } from '../../services/social-auth/google-login-provider';

import { Folder } from '../../model/folder';
import { DomSanitizer } from '@angular/platform-browser';
import { NoteManagerService } from '../../services/note-manager-service';

@Component({
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
        private noteManagerService: NoteManagerService,
        private router: Router,
        private authService: AuthService,
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

    async makeSocialLogin(user: any) {
        const result = await this.noteManagerService.loginSocial({ email: user.email, provider: user.provider, token: user.idToken })
        if (result.error != null) {
            this.signInErrorMessage = result.error;
        }
        this.isLoading = false;
        return result;
    }

    async onSocialLoginDone(user: any) {
        this.isLoading = true;
        this.signInErrorMessage = '';

        this.makeSocialLogin(user)
            .then(result => {
                if (result.error == null) {
                    this.router.navigate(['home']);
                }
            })
            .catch(err => this.handleError(err));

    }


    signInWithGoogle(): void {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(err => {
            this.signInErrorMessage = err.toString()
        })
    }

    handleError(err: any) {
        if (err.status === 401) {
            this.signInErrorMessage = "Incorrect login or password";
        }

        if (err.status === 0) {
            this.signInErrorMessage = "Cannot connect to server. Please check your connection.";
        }
        this.isLoading = false;
    }

    async makeLogin() {
        const result = await this.noteManagerService.login({ email: this.signInModel.username, password: this.signInModel.password })
        if (result.error != null) {
            this.signInErrorMessage = result.error;
        }
        this.isLoading = false;
        return result;
    }

    async login() {
        this.isLoading = true;
        this.signInErrorMessage = '';

        this.makeLogin()
            .then(result => {
                if (result.error == null) {
                    this.router.navigate(['home']);
                }
            })
            .catch(err => this.handleError(err));
    }

    async makeSignUp() {
        const result = await this.noteManagerService.signup({ email: this.registerModel.username, password: this.registerModel.password });
        if (result.error != null) {
            if (result.error === 'USER_EXISTS') {
                this.registerErrorMessage = 'User already exists.';
            } else {
                this.registerErrorMessage = result.error;
            }
        }
        this.isLoading = false;
        return result;
    }


    register() {
        this.isLoading = true;
        this.registerErrorMessage = '';

        this.makeSignUp()
            .then(result => {
                if (result.error == null) {
                    this.router.navigate(['home']);
                }
            })
            .catch(err => this.handleError(err));
    }

    doOffline() {
        this.authService.loginOffline()
            .then(r => this.noteManagerService.createRootFolderIfNotExists())
            .then(r => this.router.navigate(['home']));
        return false;
    }
}
