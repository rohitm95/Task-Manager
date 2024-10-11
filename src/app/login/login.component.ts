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
import { SpinnerService } from '../shared/spinner.service';
import { SnackbarService } from '../shared/snackbar.service';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  userLoginForm: FormGroup;
  hide = true;
  isLoadingResults;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  spinnerService = inject(SpinnerService);
  snackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.isLoadingResults = this.spinnerService.showSpinner$;
  }

  get controls() {
    return this.userLoginForm.controls;
  }

  login(formData: FormGroup) {
    this.spinnerService.showSpinner(true);
    this.authService
      .login({
        email: formData.value.email,
        password: formData.value.password,
      })
      .subscribe({
        next: (response) => {
          this.spinnerService.showSpinner(false);
          this.router.navigate(['/todo-list']);
          localStorage.setItem(
            'user',
            JSON.stringify(response.user.uid)
          );
        },
        error: (error) => {
          if (
            error.message ===
            'Firebase: Error (auth/invalid-login-credentials).'
          ) {
            this.spinnerService.showSpinner(false);
            this.snackbarService.showSnackbar(
              'Invalid login credentials',
              null,
              3000
            );
          } else {
            this.spinnerService.showSpinner(false);
            this.snackbarService.showSnackbar(error.message, null, 3000);
          }
        },
      });
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}
