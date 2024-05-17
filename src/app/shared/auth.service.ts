import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { SnackbarService } from './snackbar.service';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';
import { asyncScheduler, scheduled } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  snackbarService = inject(SnackbarService);
  router = inject(Router);
  isAuthenticated = false;
  authState$ = authState(this.auth);
  user;
  constructor() {}

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
