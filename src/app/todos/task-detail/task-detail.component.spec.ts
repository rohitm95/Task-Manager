import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../todo.service';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { MatDialog } from '@angular/material/dialog';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;
  let broadcasterServiceSpy: jasmine.SpyObj<BroadcasterService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let activatedRouteSpy: { get: jasmine.Spy };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    todoServiceSpy = jasmine.createSpyObj('TodoService', ['getTask', 'deleteTask']);
    broadcasterServiceSpy = jasmine.createSpyObj('BroadcasterService', ['recieve']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);
    activatedRouteSpy = { get: jasmine.createSpy('get') };

    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TodoService, useValue: todoServiceSpy },
        { provide: BroadcasterService, useValue: broadcasterServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set taskId with state key on ngOnInit', () => {
    const mockState = { key: 'test-id' };
    spyOnProperty(window.history, 'state').and.returnValue(mockState);

    component.ngOnInit();

    expect(component.taskId).toEqual(mockState.key);
  });

  it('should call todoService.getTask() on ngOnInit', () => {
    component.taskId = 'test-id';
    component.ngOnInit();

    expect(todoServiceSpy.getTask).toHaveBeenCalledWith(component.taskId);
  });

  it('should navigate to todo-list on goBack', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/todo-list']);
  });

  it('should open edit task dialog on editTask', () => {
    const mockTaskDetails = { id: 'test-id', title: 'Test Task' };
    component.taskDetails = mockTaskDetails;
    
    component.editTask();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should unsubscribe from subscription on ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
