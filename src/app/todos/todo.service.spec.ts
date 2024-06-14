import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('TodoService', () => {
  let service: TodoService;
  let firestoreMock: any;

  beforeEach(() => {
    const firestoreMockObj = jasmine.createSpyObj('Firestore', [
      'addDoc',
      'collection',
      'doc',
      'getDocs',
      'updateDoc',
      'deleteDoc',
      'getDoc',
      'query',
      'where',
    ]);

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: Firestore, useValue: firestoreMockObj },
      ],
    });

    service = TestBed.inject(TodoService);
    firestoreMock = TestBed.inject(Firestore);

    // Mocking Firestore collection
    firestoreMock.collection.and.returnValue({
      valueChanges: () => of([]),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user tasks', () => {
    const userId = 'testUserId';
    const userTasksQuery = {
      collection: jasmine.createSpy().and.returnValue({
        where: jasmine.createSpy().and.returnValue({
          get: jasmine.createSpy().and.returnValue(of([])),
        }),
      }),
    };
    firestoreMock.collection.and.returnValue(userTasksQuery);

    service.fetchUserTasks(userId).subscribe();

    expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
    // expect(userTasksQuery.where).toHaveBeenCalledWith('userId', '==', userId);
    // expect(userTasksQuery.where().get).toHaveBeenCalled();
  });

  it('should add a task to the database', () => {
    const task = {
      id: 'task-id',
      title: 'Test Task',
      description: 'Test Description',
      status: 'Test Status',
    };
    const newTask = {
      ...task,
      date: jasmine.any(String),
      userId: jasmine.any(String),
    };
    const addDocSpy = jasmine.createSpy().and.returnValue(of({}));

    firestoreMock.collection.and.returnValue({
      addDoc: addDocSpy,
    });

    service.addTaskToDatabase(task).subscribe();

    expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
    expect(addDocSpy).toHaveBeenCalledWith(newTask);
  });

  it('should update a task', () => {
    const task = {
      id: 'testId',
      taskData: {
        title: 'Test Task',
        description: 'Test Description',
        status: 'Test Status',
      },
    };
    const docRef = { updateDoc: jasmine.createSpy().and.returnValue(of({})) };
    firestoreMock.doc.and.returnValue(docRef);

    service.updateTask(task).subscribe();

    expect(firestoreMock.doc).toHaveBeenCalledWith('availableTasks/testId');
    expect(docRef.updateDoc).toHaveBeenCalledWith({
      title: task.taskData.title,
      description: task.taskData.description,
      status: task.taskData.status,
    });
  });

  it('should delete a task', () => {
    const id = 'testId';
    const docRef = { deleteDoc: jasmine.createSpy().and.returnValue(of({})) };
    firestoreMock.doc.and.returnValue(docRef);

    service.deleteTask(id).subscribe();

    expect(firestoreMock.doc).toHaveBeenCalledWith('availableTasks/testId');
    expect(docRef.deleteDoc).toHaveBeenCalled();
  });

  it('should get a task', () => {
    const id = 'testId';
    const docRef = { getDoc: jasmine.createSpy().and.returnValue(of({})) };
    firestoreMock.doc.and.returnValue(docRef);

    service.getTask(id).subscribe();

    expect(firestoreMock.doc).toHaveBeenCalledWith('availableTasks/testId');
    expect(docRef.getDoc).toHaveBeenCalled();
  });
});
