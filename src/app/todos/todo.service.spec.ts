import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
  provideFirestore,
  getFirestore,
  Firestore,
} from '@angular/fire/firestore';
import { Todo } from './todo.model';
import { of } from 'rxjs';

describe('TodoService', () => {
  let service: TodoService;
  let firestoreMock: any;

  beforeEach(() => {
    firestoreMock = {
      collection: jasmine.createSpy().and.returnValue({
        add: jasmine.createSpy(),
        get: jasmine.createSpy().and.returnValue(of([])),
        update: jasmine.createSpy().and.returnValue(of([]))
      }),
    };
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
        { provide: Firestore, useValue: firestoreMock },
        provideFirestore(() => getFirestore()),
      ],
    });

    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a post to the database', (done) => {
    const task: Todo = {
      id: '1',
      title: 'Test Post',
      description: 'Test Content',
      status: 'In Progress'
    };
    service.addTaskToDatabase(task).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
      done();
    });
  });

  it('should fetch user posts', (done) => {
    const userId = 'testUserId';
    service.fetchUserTasks(userId).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
      expect(firestoreMock.collection().get).toHaveBeenCalled();
      done();
    });
  });

  it('should delete a post', (done) => {
    const taskId = 'testTaskId';
    service.deleteTask(taskId).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
      done();
    });
  });

  it('should get post details', (done) => {
    const taskId = 'testTaskId';
    service.getTask(taskId).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
      done();
    });
  });

  it('should update the task details', (done) => {
    // const taskId = 'testTaskId';
    const task: Todo = {
      id: '1',
      title: 'Test Post',
      description: 'Test Content',
      status: 'In Progress'
    };
    service.updateTask(task).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
      done();
    })
  })
});
