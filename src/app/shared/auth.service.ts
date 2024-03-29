import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { SnackbarService } from './snackbar.service';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private isAuthenticated = false;
  authState$ = authState(this.auth);
  user;
  constructor(
    public snackbarService: SnackbarService,
    public router: Router
  ) {}

  registerUser = async (authData: AuthData) => {
    try {
      await createUserWithEmailAndPassword(
        this.auth,
        authData.email,
        authData.password
      )
        .then((result) => {
          this.logout();
          this.snackbarService.showSnackbar(
            'User Created! Please login',
            null,
            3000
          );
        })
        .catch((error) => {
          this.snackbarService.showSnackbar(error.message, null, 3000);
        });

      await updateProfile(this.auth.currentUser, {
        displayName: authData.name,
      }).catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  login(authData: AuthData) {
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        console.log(result);
        this.router.navigate(['/todo-list']);
      })
      .catch((error) => {
        if (
          error.message === 'Firebase: Error (auth/invalid-login-credentials).'
        ) {
          this.snackbarService.showSnackbar(
            'Invalid login credentials',
            null,
            3000
          );
        } else {
          this.snackbarService.showSnackbar(error.message, null, 3000);
        }
      });
  }

  initAuthListener() {
    this.authState$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/todo-list']);
        this.isAuthenticated = true;
      } else {
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  logout() {
    signOut(this.auth);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  getProfileDetails() {
    let displayName;
    this.authState$.subscribe((user) => {
      this.user = user;
      displayName = this.user.displayName;
    });
    return displayName;
  }
}
