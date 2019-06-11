import { LocalNoteService } from '../../services/local-note-service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { AuthService } from '../../services/auth-service';
import { LoggerService } from '../../services/logger-service';
import { SocialAuthService } from '../../services/social-auth/social-auth-service';
import { GoogleLoginProvider } from '../../services/social-auth/google-login-provider';
import { ElectronService } from '../../providers/electron.service';
import { Folder } from '../../model/folder';
import { DomSanitizer } from '@angular/platform-browser';

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
        private router: Router,
        private authService: AuthService,
        private noteService: LocalNoteService,
        private socialAuthService: SocialAuthService,
        private electronService: ElectronService,
        private loggerService: LoggerService) {

        const googleIconUrl = sanitizer.bypassSecurityTrustResourceUrl('./assets/google.svg');
        iconRegistry.addSvgIcon('google-colored', googleIconUrl);

        alert(this.electronService.fibo());
    }

    ngOnInit() {
        this.socialAuthService.authState.subscribe((user) => {
            if (user != null) {
                this.onSocialLoginDone(user)
            }
        });
    }

    async makeSocialLogin(user: any) {
        const result = await this.authService.loginSocial({ email: user.email, provider: user.provider, token: user.idToken })
        if (result.error != null) {
            this.signInErrorMessage = result.error;
        } else {
            await this.saveFolder(result);
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
        const result = await this.authService.login({ email: this.signInModel.username, password: this.signInModel.password })
        if (result.error != null) {
            this.signInErrorMessage = result.error;
        } else {
            await this.saveFolder(result);
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
        const result = await this.authService.signup({ email: this.registerModel.username, password: this.registerModel.password });
        if (result.error != null) {
            if (result.error === 'USER_EXISTS') {
                this.registerErrorMessage = 'User already exists.';
            } else {
                this.registerErrorMessage = result.error;
            }
        } else {
            await this.saveFolder(result);
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
            .then(r => this.noteService.createRootFolderIfNotExists())
            .then(r => this.router.navigate(['home']));
        return false;
    }
}
