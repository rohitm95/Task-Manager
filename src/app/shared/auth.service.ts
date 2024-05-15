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
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private spinnerService = inject(SpinnerService) 
  private auth: Auth = inject(Auth);
  snackbarService =  inject(SnackbarService);
  router = inject(Router)
  isAuthenticated = false;
  authState$ = authState(this.auth);
  user;
  constructor() {}

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
        this.spinnerService.showSpinner.next(false);
        this.router.navigate(['/todo-list']);
      })
      .catch((error) => {
        if (
          error.message === 'Firebase: Error (auth/invalid-login-credentials).'
        ) {
          this.spinnerService.showSpinner.next(false);
          this.snackbarService.showSnackbar(
            'Invalid login credentials',
            null,
            3000
          );
        } else {
          this.spinnerService.showSpinner.next(false);
          this.snackbarService.showSnackbar(error.message, null, 3000);
        }
      });
  }

  initAuthListener() {
    this.authState$.subscribe((user) => {
      if (user) {
        this.router.navigate(['/todo-list']);
      }
      this.isAuthenticated = !!user;
    });
  }

  logout() {
    signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
