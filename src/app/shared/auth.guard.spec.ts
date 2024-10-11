import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let guard: CanActivateFn;
  let routerSpy: jasmine.SpyObj<Router>;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      providers: [authGuard],
    });
    guard = TestBed.inject(authGuard);
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') {
        return null; // Default to not logged in
      }
      return null;
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  // it('should allow access if user is logged in', () => {
  //   localStorage.setItem('user', JSON.stringify({})); // Simulate user logged in
  //   const result = authGuard(null, null);
  //   expect(result).toBeTrue();
  // });

  // it('should navigate to login page if user is not logged in', () => {
  //   const result = authGuard(null, null);
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  //   expect(result).toBeUndefined(); // Since navigate returns a Promise
  // });
});
