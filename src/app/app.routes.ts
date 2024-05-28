import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './todos/dashboard/dashboard.component';
import { ListComponent } from './todos/list/list.component';
import { TaskDetailComponent } from './todos/task-detail/task-detail.component';
import { authGuard } from './shared/auth.guard';
import { ProfileComponent } from './todos/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'todo-list', pathMatch: 'full' },
      { path: 'todo-list', component: ListComponent },
      { path: 'todo/:id', component: TaskDetailComponent },
      { path: 'profile', component: ProfileComponent }
    ],
    canActivate: [authGuard]
  },
  { path: '**', component: NotFoundComponent },
];
