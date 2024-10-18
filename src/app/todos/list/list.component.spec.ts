import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { SpinnerService } from '../../shared/spinner.service';
import { TodoService } from '../todo.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddTaskComponent } from '../add-task/add-task.component';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let todoServiceMock: any;
  let snackbarServiceMock: any;
  let spinnerServiceMock: any;
  let broadcasterServiceMock: any;
  let routerMock: any;
  let dialogMock: any;

  beforeEach(async () => {
    todoServiceMock = {
      fetchUserTasks: jasmine.createSpy().and.returnValue(of({ docs: [] })),
      deleteTask: jasmine.createSpy().and.returnValue(of({})),
    };

    snackbarServiceMock = {
      showSnackbar: jasmine.createSpy(),
    };

    spinnerServiceMock = {
      showSpinner: jasmine.createSpy().and.returnValue(false),
      showSpinner$: of(false),
    };

    broadcasterServiceMock = {
      recieve: jasmine
        .createSpy()
        .and.callFake((event, callback) => callback()),
      broadcast: jasmine.createSpy(),
    };

    routerMock = {
      navigate: jasmine.createSpy(),
    };

    dialogMock = {
      open: jasmine.createSpy().and.returnValue({
        afterClosed: () => of(true),
      }),
    };
    await TestBed.configureTestingModule({
      imports: [ListComponent],
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
        { provide: TodoService, useValue: todoServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: BroadcasterService, useValue: broadcasterServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and get task list on ngOnInit', () => {
    component.ngOnInit();

    expect(broadcasterServiceMock.recieve).toHaveBeenCalledWith(
      'reloadList',
      jasmine.any(Function)
    );
    expect(todoServiceMock.fetchUserTasks).toHaveBeenCalledWith('testUserId');
  });

  it('should fetch user tasks and populate dataSource', (done) => {
    const mockTasks = [
      {
        id: '1',
        data: () => ({
          title: 'Task 1',
          description: 'Description 1',
          status: 'To Do',
          date: '2023-01-01',
        }),
      },
      {
        id: '2',
        data: () => ({
          title: 'Task 2',
          description: 'Description 2',
          status: 'In Progress',
          date: '2023-01-02',
        }),
      },
    ];

    todoServiceMock.fetchUserTasks.and.returnValue(of({ docs: mockTasks }));

    component.getTaskList();

    // Simulate async behavior
    setTimeout(() => {
      expect(component.dataSource.data.length).toBe(2);
      expect(component.dataSource.data).toEqual([
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'To Do',
          date: '2023-01-01',
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          status: 'In Progress',
          date: '2023-01-02',
        },
      ]);
      done();
    }, 0);
  });

  it('should show snackbar on error fetching tasks', (done) => {
    todoServiceMock.fetchUserTasks.and.returnValue(throwError(() => new Error('Error')));

    component.getTaskList();

    // Simulate async behavior
    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith(
        'Error fetching user tasks: ',
        null,
        3000
      );
      done();
    }, 0);
  });

  it('should navigate to view task', () => {
    component.viewTask('1');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/todo', '1']);
  });

  it('should delete a task successfully', (done) => {
    const mockTask = {
      id: '1',
      title: 'Task 1',
      status: 'In Progress',
      description: '',
    };
    component.data = [mockTask];

    component.deleteTask('1');

    expect(dialogMock.open).toHaveBeenCalledWith(DeleteTaskComponent, {
      data: mockTask,
    });

    // Simulate async behavior
    setTimeout(() => {
      expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(true);
      expect(todoServiceMock.deleteTask).toHaveBeenCalledWith('1');
      expect(broadcasterServiceMock.broadcast).toHaveBeenCalledWith(
        'reloadList',
        {}
      );
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith(
        'Task deleted SUccessfully!',
        null,
        3000
      );
      done();
    }, 0);
  });

  it('should show snackbar on delete task error', (done) => {
    const mockTask = {
      id: '1',
      title: 'Task 1',
      status: 'In Progress',
      description: '',
    };
    component.data = [mockTask];
    todoServiceMock.deleteTask.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.deleteTask('1');

    // Simulate async behavior
    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith(
        'Oops, some error occurred. Please try again!',
        null,
        3000
      );
      done();
    }, 0);
  });

  it('should open edit task dialog', () => {
    const mockTask = {
      id: '1',
      title: 'Task 1',
      status: 'In Progress',
      description: 'Edit',
    };
    component.data = [mockTask];

    component.editTask('1');

    expect(dialogMock.open).toHaveBeenCalledWith(AddTaskComponent, {
      data: { result: mockTask, editMode: true },
    });
  });

  it('should open add new task dialog', () => {
    component.addNewTask();

    expect(dialogMock.open).toHaveBeenCalledWith(AddTaskComponent, {
      data: { editMode: false },
    });
  });
});
