import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerService } from '../shared/spinner.service';
import { SnackbarService } from '../shared/snackbar.service';
import { LocalStorageService } from '../shared/localstorage.service';
import { Subscription } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['showSpinner']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showSnackbar']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy }
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

  it('should subscribe to spinnerService.showSpinner', () => {
    const mockSubscription = new Subscription();
    spyOn(spinnerServiceSpy.showSpinner, 'subscribe').and.returnValue(mockSubscription);
    expect(spinnerServiceSpy.showSpinner.subscribe).toHaveBeenCalled();
    expect(component.isLoadingResults).toBe(false);
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

  it('should have email and password controls', () => {
    expect(component.userLoginForm.get('email')).toBeDefined();
    expect(component.userLoginForm.get('password')).toBeDefined();
  });
  
  it('should have email control as required', () => {
    const emailControl = component.userLoginForm.get('email');
    emailControl.setValue('');
    expect(emailControl.valid).toBeFalsy();
    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();
  });
  
  it('should have password control as required', () => {
    const passwordControl = component.userLoginForm.get('password');
    passwordControl.setValue('');
    expect(passwordControl.valid).toBeFalsy();
    passwordControl.setValue('password123');
    expect(passwordControl.valid).toBeTruthy();
  });
});
