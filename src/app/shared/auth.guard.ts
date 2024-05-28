import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from './localstorage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localstorageService = inject(LocalStorageService);

  return localstorageService.getItem('user') ? true : router.navigate(['/login']);
};
