import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
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
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should register a new user successfully', async () => {
  //   const authData: AuthData = {
  //     email: 'test@example.com',
  //     password: 'test123',
  //   };

  //   await service.registerUser(authData);

  //   expect(service.logout).toHaveBeenCalled();
  // });

  // it('should log in a user successfully', async () => {
  //   const authData: AuthData = {
  //     email: 'test@example.com',
  //     password: 'test123',
  //   };
  //   await service.login(authData);

  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/todo-list']);
  // });

  // it('should handle invalid login credentials', async () => {
  //   const authData: AuthData = {
  //     email: 'invalid@example.com',
  //     password: 'invalid123',
  //   };

  //   await service.login(authData);
  // });
});
