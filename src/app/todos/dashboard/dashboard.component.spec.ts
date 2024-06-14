import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../shared/auth.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Auth } from '@angular/fire/auth';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authSpy: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      authState$: of({ displayName: 'Test User' }),
    });
    authSpy = jasmine.createSpyObj('Auth', ['authState']);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Auth, useValue: authSpy },
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
  // ...

  it('should call authService.logout() when logOut() is called', () => {
    component.logOut();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should update user on authState change', () => {
    const testUser = { displayName: 'Test User' };
    // component.authState$.next(testUser);

    expect(component.user).toEqual(testUser);
  });
});
