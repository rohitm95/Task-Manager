import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const activatedRouteMock = {
      params: from([{ id: '123' }]), // Mocking route parameters
      // You can add other properties like 'data', 'queryParams', etc. as needed
    };
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, BrowserAnimationsModule],
      providers: [
        provideFirebaseApp(() =>
          initializeApp({
            projectId: 'to-do-app-3569d',
            appId: '1:665738202763:web:c08911a6f36c6c3bbbce8e',
            storageBucket: 'to-do-app-3569d.appspot.com',
            apiKey: 'AIzaSyDmWSsxJJAlzt60_hMRcT9JGGm4EiWqkbw',
            authDomain: 'to-do-app-3569d.firebaseapp.com',
            messagingSenderId: '665738202763',
            measurementId: 'G-0B32KQX4NF',
          })
        ),
        provideAuth(() => getAuth()),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock, // Provide the mock
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout() when logOut() is called', () => {
    component.logOut();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
