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
    
      return createUserWithEmailAndPassword(
        this.auth,
        authData.email,
        authData.password
      )
        
  };

  login(authData: AuthData) {
    return signInWithEmailAndPassword(this.auth, authData.email, authData.password)
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
