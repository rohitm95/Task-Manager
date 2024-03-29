import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registerUser']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SignupComponent, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create userSignupForm FormGroup with required controls', () => {
    expect(component.userSignupForm).toBeDefined();
    expect(component.userSignupForm.get('email')).toBeDefined();
    expect(component.userSignupForm.get('password')).toBeDefined();
    expect(component.userSignupForm.get('name')).toBeDefined();
    expect(component.controls['email'].valid).toBeFalsy();
    expect(component.controls['password'].valid).toBeFalsy();
    expect(component.controls['name'].valid).toBeFalsy();
  });

  it('should call navigateToSignIn() to navigate to login page', () => {
    component.navigateToSignIn();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call authService.registerUser() with form value on signup()', () => {
    const formValue = {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
    };
    component.userSignupForm.patchValue(formValue);
    component.signup(component.userSignupForm);
    expect(authServiceSpy.registerUser).toHaveBeenCalledWith(formValue);
  });
});
