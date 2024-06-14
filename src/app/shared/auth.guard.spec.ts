import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { LocalStorageService } from './localstorage.service';

describe('authGuard', () => {
  let guard: CanActivateFn;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        authGuard,
        { provide: Router, useValue: routerSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
      ],
    });
    guard = TestBed.inject(authGuard);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'getItem',
    ]);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user is logged in', () => {
    spyOn(localStorageServiceSpy, 'getItem').and.returnValue('user');
    const canActivate = guard(null, null);
    expect(canActivate).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login page if user is not logged in', () => {
    spyOn(localStorageServiceSpy, 'getItem').and.returnValue(null);
    const canActivate = guard(null, null);
    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
