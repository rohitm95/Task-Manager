import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { SnackbarService } from '../shared/snackbar.service';
import { SpinnerService } from '../shared/spinner.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;
  let spinnerSpy: jasmine.SpyObj<SpinnerService>;
  
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    snackbarSpy = jasmine.createSpyObj('SnackbarService', ['showSnackbar']);
    spinnerSpy = jasmine.createSpyObj('SpinnerService', ['showSpinner']);
    await TestBed.configureTestingModule({
      imports: [ LoginComponent, BrowserAnimationsModule ],
      providers: [
        provideFirebaseApp(() =>
          initializeApp({
            projectId: 'to-do-app-3569d',
            appId: '1:665738202763:web:c08911a6f36c6c3bbbce8e',
            storageBucket: 'to-do-app-3569d.appspot.com',
            apiKey: 'AIzaSyDmWSsxJJAlzt60_hMRcT9JGGm4EiWqkbw',
            authDomain: 'to-do-app-3569d.firebaseapp.com',
            messagingSenderId: '665738202763',
            measurementId: 'G-0B32KQX4NF',
          })
        ),
        provideAuth(() => getAuth()),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to signup page when navigateToSignUp() is called', () => {
    component.navigateToSignUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should initialize the form with two controls', () => {
    component.ngOnInit();
    expect(component.userLoginForm.contains('email')).toBeTrue();
    expect(component.userLoginForm.contains('password')).toBeTrue();
  });

  it('should handle login error with invalid credentials', () => {
    component.ngOnInit();
    const errorResponse = { message: 'Firebase: Error (auth/invalid-login-credentials).' };
    authSpy.login.and.returnValue(throwError(() => new Error(errorResponse.message)));

    component.login(component.userLoginForm);

    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(true);
    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(false);
    expect(snackbarSpy.showSnackbar).toHaveBeenCalledWith('Invalid login credentials', null, 3000);
  });

  it('should handle generic login error', () => {
    component.ngOnInit();
    const errorResponse = 'Some other error occurred.';
    authSpy.login.and.returnValue(throwError(() => new Error(errorResponse)));

    component.login(component.userLoginForm);

    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(true);
    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(false);
    expect(snackbarSpy.showSnackbar).toHaveBeenCalledWith('Some other error occurred.', null, 3000);
  });
});
