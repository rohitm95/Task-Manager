import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../shared/spinner.service';
import { SnackbarService } from '../shared/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  userLoginForm: FormGroup;
  hide = true;
  isLoadingResults = false;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  spinnerService = inject(SpinnerService);
  subscription: Subscription;
  snackbarService = inject(SnackbarService);

  constructor() {}

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.subscription = this.spinnerService.showSpinner.subscribe(
      (response) => {
        this.isLoadingResults = response;
      }
    );
  }

  get controls() {
    return this.userLoginForm.controls;
  }

  login(formData: FormGroup) {
    this.spinnerService.showSpinner.next(true);
    this.authService
      .login({
        email: formData.value.email,
        password: formData.value.password,
      })
      .subscribe({
        next: (response) => {
          this.spinnerService.showSpinner.next(false);
          this.router.navigate(['/todo-list']);
        },
        error: (error) => {
          if (
            error.message ===
            'Firebase: Error (auth/invalid-login-credentials).'
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
        },
      });
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}
