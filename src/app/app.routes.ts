import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './todos/dashboard/dashboard.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then((c) => c.SignupComponent),
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'todo-list', pathMatch: 'full' },
      {
        path: 'todo-list',
        loadComponent: () =>
          import('./todos/list/list.component').then((c) => c.ListComponent),
      },
      {
        path: 'todo/:id',
        loadComponent: () =>
          import('./todos/task-detail/task-detail.component').then(
            (c) => c.TaskDetailComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./todos/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
    ],
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];
