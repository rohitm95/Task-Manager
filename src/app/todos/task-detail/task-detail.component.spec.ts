import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const activatedRouteMock = {
      params: from([{ id: '123' }]), // Mocking route parameters
      // You can add other properties like 'data', 'queryParams', etc. as needed
    };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
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
        provideFirestore(() => getFirestore()),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock, // Provide the mock
        },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set taskId with state key on ngOnInit', () => {
    const mockState = { key: '123' };
    spyOnProperty(window.history, 'state').and.returnValue(mockState);

    component.ngOnInit();

    expect(component.taskId).toEqual(mockState.key);
  });

  it('should navigate to previous page when goBack() is called', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todo-list']);
  });
});
