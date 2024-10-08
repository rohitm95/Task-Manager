import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../shared/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    HeaderComponent,
    NgOptimizedImage
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  opened = true;
  user;
  auth = inject(Auth);
  authService = inject(AuthService);
  authState$ = authState(this.auth);

  ngOnInit(): void {
    this.authState$.subscribe((user) => {
      this.user = user;
    });
  }

  logOut() {
    this.authService.logout();
  }
}
