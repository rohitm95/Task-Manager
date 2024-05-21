import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  authService.initAuthListener();
  const router = inject(Router);

  return authService.isUserLoggedIn() ? true : router.createUrlTree(['/login']);
};
