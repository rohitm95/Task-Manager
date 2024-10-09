import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
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
        provideFirestore(() => getFirestore()),
      ]
    });

    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
