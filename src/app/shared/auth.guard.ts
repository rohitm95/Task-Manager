import { inject } from '@angular/core';
import { CanActivateFn, CanLoadFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth() ? true : router.createUrlTree(['/login']);
};
