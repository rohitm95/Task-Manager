import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create userLoginForm FormGroup with required controls', () => {
    expect(component.userLoginForm).toBeDefined();
    expect(component.userLoginForm.get('email')).toBeDefined();
    expect(component.userLoginForm.get('password')).toBeDefined();
    expect(component.controls['email'].valid).toBeFalsy();
    expect(component.controls['password'].valid).toBeFalsy();
  });

  it('should call AuthService.login() when login() is called', () => {
    const formData = component.userLoginForm;
    component.login(formData);
    expect(authServiceSpy.login).toHaveBeenCalled();
  });

  it('should navigate to signup page when navigateToSignUp() is called', () => {
    component.navigateToSignUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup']);
  });
});
