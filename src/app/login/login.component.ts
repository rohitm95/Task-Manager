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
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  userLoginForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get controls() {
    return this.userLoginForm.controls;
  }

  login(formData: FormGroup) {
    this.authService.login({
      email: formData.value.email,
      password: formData.value.password,
    });
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}
