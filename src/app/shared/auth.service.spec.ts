import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { Auth } from '@angular/fire/auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, SnackbarService, Auth],
    });
  });

  it('should be created', () => {
    const service: AuthService = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should register a new user successfully', async () => {
    const snackBarService: SnackbarService = TestBed.inject(SnackbarService);
    const authData = {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User',
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
    const authData = { email: 'test@example.com', password: 'test123' };
    spyOn(service.router, 'navigate');
    spyOn(service.snackbarService, 'showSnackbar');

    await service.login(authData);

    expect(service.router.navigate).toHaveBeenCalledWith(['/todo-list']);
  });

  it('should handle invalid login credentials', async () => {
    const authData = { email: 'invalid@example.com', password: 'invalid123' };
    spyOn(service.snackbarService, 'showSnackbar');

    await service.login(authData);

    expect(service.snackbarService.showSnackbar).toHaveBeenCalledWith(
      'Invalid login credentials',
      null,
      3000
    );
  });

  it('should initialize auth listener and navigate to todo-list if user is authenticated', () => {
    const fakeUser = { uid: 'fakeUser123' };
    spyOn(service.authState$, 'subscribe').and.callFake((callback) =>
      callback(fakeUser)
    );
    spyOn(service.router, 'navigate');

    service.initAuthListener();

    expect(service.router.navigate).toHaveBeenCalledWith(['/todo-list']);
    expect(service.isAuth()).toBeTrue();
  });

  it('should initialize auth listener and navigate to login if user is not authenticated', () => {
    spyOn(service.authState$, 'subscribe').and.callFake((callback) =>
      callback(null)
    );
    spyOn(service.router, 'navigate');

    service.initAuthListener();

    expect(service.router.navigate).toHaveBeenCalledWith(['/login']);
    expect(service.isAuth()).toBeFalse();
  });

  it('should log out a user', () => {
    jasmine.createSpy('logout').and.callThrough();

    service.logout();
  });
});
