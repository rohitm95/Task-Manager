import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskComponent } from './add-task.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskComponent, BrowserAnimationsModule],
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
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') } // Mock MatDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {} // Provide any data needed for the test
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
