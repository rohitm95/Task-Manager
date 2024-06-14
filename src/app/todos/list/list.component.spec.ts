import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { MatDialog } from '@angular/material/dialog';
import { TodoService } from '../todo.service';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Auth } from '@angular/fire/auth';
import { SpinnerService } from '../../shared/spinner.service';
import { SnackbarService } from '../../shared/snackbar.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let broadcasterServiceSpy: jasmine.SpyObj<BroadcasterService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<Auth>;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);
    todoServiceSpy = jasmine.createSpyObj('TodoService', [
      'fetchAvailableTasks',
      'deleteTask',
    ]);
    broadcasterServiceSpy = jasmine.createSpyObj('BroadcasterService', [
      'recieve',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    authSpy = jasmine.createSpyObj('Auth', ['signOut']);
    spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['showSpinner']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['showSnackbar']);

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: TodoService, useValue: todoServiceSpy },
        { provide: BroadcasterService, useValue: broadcasterServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Auth, useValue: authSpy },
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
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

  it('should initialize dataSource with MatTableDataSource', () => {
    expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
  });

  it('should emit data on ngOnInit', () => {
    component.ngOnInit();
    spinnerServiceSpy.showSpinner.subscribe((message) => {
      expect(message).toBe(false);
    });
  });

  it('should navigate to todo details page on viewTask', () => {
    const id = 'test-id';
    component.viewTask(id);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/todo', {
      state: { key: id },
    });
  });

  it('should open delete task dialog on deleteTask', () => {
    const id = 'test-id';
    component.deleteTask(id);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(spinnerServiceSpy.showSpinner.next).toHaveBeenCalledWith(true);
    expect(todoServiceSpy.deleteTask).toHaveBeenCalledWith(id);
  });

  it('should open edit task dialog on editTask', () => {
    const id = 'test-id';
    const mockTask = {
      id: id,
      title: 'Test Task',
      description: 'Description task',
      status: 'In Progress',
    };
    component.data = [mockTask];

    component.editTask(id);
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should open add new task dialog on addNewTask', () => {
    component.addNewTask();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should unsubscribe from subscription on ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});