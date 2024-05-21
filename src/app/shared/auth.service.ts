import { Injectable, PLATFORM_ID, inject } from '@angular/core';
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
import { isPlatformBrowser } from '@angular/common';

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
  private platformId: Object = inject(PLATFORM_ID);

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

  createSession(user: string) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('user', user);
    }
  }

  isUserLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      return !!sessionStorage.getItem('user');
    } else {
      return false;
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      if (sessionStorage.getItem('user')) {
        sessionStorage.removeItem('user');
      }
    }
    signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
