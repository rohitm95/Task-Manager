import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../shared/auth.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      authState$: of({ displayName: 'Test User' }),
    });
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, BrowserAnimationsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
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

  it('should have initial values set', () => {
    expect(component.opened).toBeTrue();
    expect(component.panelOpenState).toBeFalse();
    expect(component.user).toBeUndefined();
    expect(component.displayName).toEqual('');
  });

  it('should call authService.logout() when logOut() is called', () => {
    component.logOut();

    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should update user and displayName on authState change', () => {
    expect(component.user).toEqual({ displayName: 'Test User' });
    expect(component.displayName).toEqual('Test User');
  });
});
