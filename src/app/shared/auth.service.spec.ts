import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';

describe('AuthService', () => {
  let service: AuthService;
  let snackbarService: SnackbarService;
  let auth: Auth;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        SnackbarService,
        Auth,
        Router,
      ],
    });
    service = TestBed.inject(AuthService);
    snackbarService = TestBed.inject(SnackbarService);
    auth = TestBed.inject(Auth);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    const service: AuthService = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should register a new user successfully', async () => {
    const authData: AuthData = {
      email: 'test@example.com',
      password: 'test123',
    };
    spyOn(service.snackbarService, 'showSnackbar');

    await service.registerUser(authData);

    expect(service.logout).toHaveBeenCalled();
    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith(
      'User Created! Please login',
      null,
      3000
    );
  });

  it('should log in a user successfully', async () => {
    const authData: AuthData = {
      email: 'test@example.com',
      password: 'test123',
    };
    spyOn(service.router, 'navigate');
    spyOn(service.snackbarService, 'showSnackbar');

    await service.login(authData);

    expect(service.router.navigate).toHaveBeenCalledWith(['/todo-list']);
  });

  it('should handle invalid login credentials', async () => {
    const authData: AuthData = {
      email: 'invalid@example.com',
      password: 'invalid123',
    };
    spyOn(service.snackbarService, 'showSnackbar');

    await service.login(authData);

    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith(
      'Invalid login credentials',
      null,
      3000
    );
  });
});
