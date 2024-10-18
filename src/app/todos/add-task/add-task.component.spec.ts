import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskComponent } from './add-task.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { SpinnerService } from '../../shared/spinner.service';
import { TodoService } from '../todo.service';
import { FormBuilder } from '@angular/forms';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let todoServiceMock: any;
  let snackbarServiceMock: any;
  let spinnerServiceMock: any;
  let broadcasterServiceMock: any;
  let dialogRefMock: any;

  beforeEach(async () => {
    todoServiceMock = {
      addTaskToDatabase: jasmine.createSpy().and.returnValue(of({})),
      updateTask: jasmine.createSpy().and.returnValue(of({})),
    };

    snackbarServiceMock = {
      showSnackbar: jasmine.createSpy(),
    };

    spinnerServiceMock = {
      showSpinner: jasmine.createSpy(),
    };

    broadcasterServiceMock = {
      broadcast: jasmine.createSpy(),
    };

    dialogRefMock = {
      close: jasmine.createSpy(),
    };
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
        { provide: TodoService, useValue: todoServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: BroadcasterService, useValue: broadcasterServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { editMode: false } }
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

  it('should create the form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.toDoForm).toBeDefined();
    expect(component.toDoForm.controls['title'].validator).toBeDefined();
    expect(component.toDoForm.controls['description'].validator).toBeDefined();
    expect(component.toDoForm.controls['status'].validator).toBeDefined();
  });

  it('should create a task successfully', (done) => {
    component.toDoForm = new FormBuilder().group({
      title: ['Test Task'],
      description: ['Test Description'],
      status: ['To Do'],
    });

    component.createTask();

    expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(true);
    expect(todoServiceMock.addTaskToDatabase).toHaveBeenCalledWith(component.toDoForm.value);

    // Simulate successful response
    setTimeout(() => {
      expect(broadcasterServiceMock.broadcast).toHaveBeenCalledWith('reloadList', {});
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Task Created!', null, 3000);
      done();
    }, 0);
  });

  it('should show snackbar on create task error', (done) => {
    const errorMessage = 'Error creating task';
    todoServiceMock.addTaskToDatabase.and.returnValue(throwError(() => new Error('')));

    component.toDoForm = new FormBuilder().group({
      title: ['Test Task'],
      description: ['Test Description'],
      status: ['To Do'],
    });

    component.createTask();

    // Simulate error response
    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Oops, some error occurred. Please try again!', null, 3000);
      done();
    }, 0);
  });

  it('should close the dialog and reset the form on onNoClick', () => {
    component.onNoClick();

    expect(dialogRefMock.close).toHaveBeenCalled();
    expect(component.toDoForm.value).toEqual({
      title: '',
      description: '',
      status: '',
    });
  });

  it('should update a task successfully', (done) => {
    component.data = { editMode: true, result: { id: '1', title: 'Updated Task', description: 'Updated Description', status: 'In Progress' } };
    component.ngOnInit(); // Initialize the form with data

    component.updateTask();

    expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(true);
    expect(todoServiceMock.updateTask).toHaveBeenCalledWith({
      id: component.taskId,
      taskData: component.toDoForm.value,
    });

    // Simulate successful response
    setTimeout(() => {
      expect(broadcasterServiceMock.broadcast).toHaveBeenCalledWith('reloadList', {});
      expect(broadcasterServiceMock.broadcast).toHaveBeenCalledWith('updateTask', { status: 'success' });
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Task Updated!', null, 3000);
      expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(false);
      done();
    }, 0);
  });

  it('should show snackbar on update task error', (done) => {
    const errorMessage = 'Error updating task';
    todoServiceMock.updateTask.and.returnValue(throwError(() => new Error('')));

    component.updateTask();

    // Simulate error response
    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Oops, some error occurred. Please try again!', null, 3000);
      done();
    }, 0);
  });
});
