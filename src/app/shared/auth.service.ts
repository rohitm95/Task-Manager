import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { SnackbarService } from './snackbar.service';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { asyncScheduler, scheduled } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly auth: Auth = inject(Auth);
  snackbarService = inject(SnackbarService);
  router = inject(Router);

  registerUser(authData: AuthData) {
    return scheduled(
      createUserWithEmailAndPassword(
        this.auth,
        authData.email,
        authData.password
      ),
      asyncScheduler
    );
  }

  login(authData: AuthData) {
    return scheduled(
      signInWithEmailAndPassword(this.auth, authData.email, authData.password),
      asyncScheduler
    );
  }

  logout() {
    localStorage.removeItem('user');
    signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
