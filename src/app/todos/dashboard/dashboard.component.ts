import {
  AfterViewChecked,
  ChangeDetectorRef,
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
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '../../shared/spinner.service';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  opened = true;
  panelOpenState = false;
  user;
  displayName = '';
  auth = inject(Auth);
  authService = inject(AuthService);
  authState$ = authState(this.auth);
  subscription: Subscription;
  isLoadingResults = true;
  spinnerService = inject(SpinnerService);
  cdRef = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.subscription = this.authState$.subscribe((user) => {
      this.user = user;
      this.displayName = this.user.displayName;
    });

    this.subscription = this.spinnerService.showSpinner.subscribe(
      (response) => {
        this.isLoadingResults = response;
      }
    );
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  logOut() {
    this.authService.logout();
  }

}
