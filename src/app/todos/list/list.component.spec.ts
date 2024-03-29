import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { MatDialog } from '@angular/material/dialog';
import { TodoService } from '../todo.service';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let broadcasterServiceSpy: jasmine.SpyObj<BroadcasterService>;
  let routerSpy: jasmine.SpyObj<Router>;

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

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: TodoService, useValue: todoServiceSpy },
        { provide: BroadcasterService, useValue: broadcasterServiceSpy },
        { provide: Router, useValue: routerSpy },
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
    todoServiceSpy.showSpinner.subscribe((message) => {
      expect(message).toBe(false);
    });

    todoServiceSpy.showSpinner.next(false);
  });

  it('should call todoService.fetchAvailableTasks() on ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(todoServiceSpy.fetchAvailableTasks).toHaveBeenCalled();
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
    // dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });

    component.deleteTask(id);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(todoServiceSpy.showSpinner.next).toHaveBeenCalledWith(true);
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
