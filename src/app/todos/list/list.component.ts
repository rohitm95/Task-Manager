import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TodoService } from '../todo.service';
import { Subscription } from 'rxjs';
import { Todo } from '../todo.model';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatInputModule,
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule,
    DatePipe,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['title', 'status', 'created', 'actions'];
  dataSource = new MatTableDataSource();
  data: Todo[] = [];
  isLoadingResults = true;
  subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public todoService: TodoService,
    private broadcast: BroadcasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.broadcast.recieve('availableTasks', (response) => {
      this.dataSource.data = response.tasks;
      this.data = response.tasks;
    });

    this.subscription = this.todoService.showSpinner.subscribe((response) => {
      this.isLoadingResults = response;
    });
  }

  ngAfterViewInit(): void {
    this.todoService.fetchAvailableTasks();
    this.dataSource.sort = this.sort;
  }

  viewTask(id) {
    this.router.navigateByUrl('/todo', { state: { key: id } });
  }

  deleteTask(id) {
    const dialogRef = this.dialog.open(DialogDeleteTaskComponent);

    dialogRef.afterClosed().subscribe((response) => {
      this.todoService.showSpinner.next(true);
      this.todoService.deleteTask(id);
    });
  }

  editTask(id) {
    let result = this.data.find((task) => task.id == id);
    this.dialog.open(DialogAddTaskComponent, {
      data: { result: result, editMode: true },
    });
  }

  addNewTask() {
    this.dialog.open(DialogAddTaskComponent, {
      data: { editMode: false },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

@Component({
  selector: 'dialog-add-task',
  templateUrl: './dialog-add-task.component.html',
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class DialogAddTaskComponent implements OnInit {
  toDoForm: FormGroup;
  statusList = [
    { value: 'To Do', viewValue: 'To Do' },
    { value: 'In Progress', viewValue: 'In Progress' },
    { value: 'Done', viewValue: 'Done' },
  ];
  editMode;
  taskId;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogAddTaskComponent>,
    public todoService: TodoService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    this.toDoForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
    if (this.data.editMode) {
      this.toDoForm.patchValue({
        title: this.data.result.title,
        description: this.data.result.description,
        status: this.data.result.status,
      });
      if (this.data.result.id) {
        this.taskId = this.data.result.id;
      } else {
        this.taskId = this.data.id;
      }
    }
  }

  createTask() {
    this.todoService.showSpinner.next(true);
    this.todoService.addTaskToDatabase(this.toDoForm.value);
  }

  onNoClick() {
    this.dialogRef.close();
    this.toDoForm.reset();
  }

  updateTask() {
    this.todoService.showSpinner.next(true);
    const payload = {
      id: this.taskId,
      taskData: this.toDoForm.value,
    };
    this.toDoForm.reset();
    this.todoService.updateTask(payload);
  }
}

@Component({
  selector: 'dialog-delete-task',
  templateUrl: './dialog-delete-task.component.html',
  imports: [MatDialogModule, MatButtonModule],
  standalone: true,
})
export class DialogDeleteTaskComponent {
  constructor(public dialogRef: MatDialogRef<DialogDeleteTaskComponent>) {}
}
