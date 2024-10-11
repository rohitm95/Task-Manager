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
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { SnackbarService } from '../shared/snackbar.service';
import { Auth, updateProfile } from '@angular/fire/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '../shared/spinner.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  userSignupForm: FormGroup;
  hide = true;
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackbarService = inject(SnackbarService);
  auth = inject(Auth);
  isLoadingResults;
  spinnerService = inject(SpinnerService);

  ngOnInit(): void {
    this.userSignupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });

    this.isLoadingResults = this.spinnerService.showSpinner$;
  }

  get controls() {
    return this.userSignupForm.controls;
  }

  navigateToSignIn() {
    this.router.navigate(['/login']);
  }

  signup(formvalue: FormGroup) {
    this.spinnerService.showSpinner(true);
    this.authService.registerUser(formvalue.value).subscribe({
      next: (response) => {
        this.authService.logout();
        this.snackbarService.showSnackbar(
          'User Created! Please login',
          null,
          3000
        );
        updateProfile(this.auth.currentUser, {
          displayName: formvalue.value.name,
          photoURL: 'https://firebase.googleapis.com/v0/b/to-do-app-3569d.appspot.com/o/default-profile-pic.png?alt=media&token=09a77c81-9576-438c-8c35-a74119a26103',
        }).catch((err) => console.log(err));
      },
      error: (error) => {
        this.snackbarService.showSnackbar(error.message, null, 3000);
      },
    });
  }
}
