import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  userSignupForm: FormGroup;
  hide = true;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.userSignupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  get controls() {
    return this.userSignupForm.controls;
  }

  navigateToSignIn() {
    this.router.navigate(['/login']);
  }

  signup(formvalue: FormGroup) {
    this.authService.registerUser(formvalue.value)
  }
}
