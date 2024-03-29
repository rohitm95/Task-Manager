import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { Firestore } from '@angular/fire/firestore';
import { Subject, of } from 'rxjs';
import { SnackbarService } from '../shared/snackbar.service';
import { BroadcasterService } from '../shared/broadcaster.service';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';

describe('TodoService', () => {
  let service: TodoService;
  let firestoreMock: any;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let broadcasterServiceSpy: jasmine.SpyObj<BroadcasterService>;
  let showSpinnerSpy: jasmine.SpyObj<Subject<boolean>>;

  beforeEach(() => {
    const firestoreMockObj = jasmine.createSpyObj('Firestore', ['collection']);
    const snackbarServiceSpyObj = jasmine.createSpyObj('SnackbarService', ['showSnackbar']);
    const broadcasterServiceSpyObj = jasmine.createSpyObj('BroadcasterService', ['broadcast']);
    const showSpinnerSpyObj = jasmine.createSpyObj('Subject', ['next']);

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: Firestore, useValue: firestoreMockObj },
        { provide: SnackbarService, useValue: snackbarServiceSpyObj },
        { provide: BroadcasterService, useValue: broadcasterServiceSpyObj },
      ],
    });

    service = TestBed.inject(TodoService);
    firestoreMock = TestBed.inject(Firestore);
    snackbarServiceSpy = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
    broadcasterServiceSpy = TestBed.inject(BroadcasterService) as jasmine.SpyObj<BroadcasterService>;
    showSpinnerSpy = TestBed.inject(Subject) as jasmine.SpyObj<Subject<boolean>>;

    // Mocking Firestore collection
    firestoreMock.collection.and.returnValue({
      valueChanges: () => of([]),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch available tasks successfully', () => {
    service.fetchAvailableTasks();

    expect(firestoreMock.collection).toHaveBeenCalledWith('availableTasks');
    expect(broadcasterServiceSpy.broadcast).toHaveBeenCalledWith('availableTasks', { tasks: [] });
    expect(showSpinnerSpy.next).toHaveBeenCalledWith(false);
  });

  it('should handle error while fetching available tasks', () => {
    firestoreMock.collection.and.throwError('Error fetching tasks');
    service.fetchAvailableTasks();

    expect(snackbarServiceSpy.showSnackbar).toHaveBeenCalledWith(
      'Fetching tasks failed, please try again later',
      null,
      3000
    );
    expect(broadcasterServiceSpy.broadcast).toHaveBeenCalledWith('availableTasks', { tasks: null });
  });

  it('should add task to database successfully', async () => {
    const mockTask = { id: '1', title: 'Test Task', description: 'Test Description', status: 'Pending' };

    await service.addTaskToDatabase(mockTask);

    expect(addDoc).toHaveBeenCalledWith(collection(firestoreMock, 'availableTasks'), {
      ...mockTask,
      date: jasmine.any(String),
    });
    expect(snackbarServiceSpy.showSnackbar).toHaveBeenCalledWith('Task Created!', null, 3000);
    expect(service.fetchAvailableTasks).toHaveBeenCalled();
  });

  // Similar test cases can be written for updateTask, deleteTask, and getTask methods
});
