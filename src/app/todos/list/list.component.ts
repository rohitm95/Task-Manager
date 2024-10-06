import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
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
import { Auth, authState } from '@angular/fire/auth';
import { SpinnerService } from '../../shared/spinner.service';
import { SnackbarService } from '../../shared/snackbar.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
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
  spinnerService = inject(SpinnerService);
  auth = inject(Auth);
  dialog = inject(MatDialog);
  todoService = inject(TodoService);
  broadcast = inject(BroadcasterService);
  router = inject(Router);
  authState$ = authState(this.auth);
  snackbarService = inject(SnackbarService);

  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit(): void {
    this.broadcast.recieve('reloadList', () => {
      this.getTaskList();
    });

    this.subscription = this.spinnerService.showSpinner.subscribe(
      (response) => {
        this.isLoadingResults = response;
      }
    );
  }

  getTaskList() {
    this.authState$.subscribe((user) => {
      if (user) {
        this.todoService.fetchUserTasks(user.uid).subscribe({
          next: (querySnapshot) => {
            let docs = querySnapshot.docs;
            const availableTasks = docs.map((doc) => {
              return {
                id: doc.id,
                title: doc.data()['title'],
                description: doc.data()['description'],
                status: doc.data()['status'],
                date: doc.data()['date'],
              };
            });
            this.dataSource.data = availableTasks;
            this.data = availableTasks;
            this.spinnerService.showSpinner.next(false);
          },
          error: (error) => {
            this.snackbarService.showSnackbar(
              'Error fetching user tasks: ',
              null,
              3000
            );
          },
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.getTaskList();
    this.dataSource.sort = this.sort;
  }

  viewTask(id) {
    this.router.navigate(['/todo', id]);
  }

  deleteTask(id) {
    let result = this.data.find((task) => task.id == id);
    const dialogRef = this.dialog.open(DialogDeleteTaskComponent, {
      data: result,
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.spinnerService.showSpinner.next(true);
        this.todoService.deleteTask(id).subscribe({
          next: (response) => {
            this.broadcast.broadcast('reloadList', {});
            this.broadcast.broadcast('deleteTask', { status: 'success' });
            this.spinnerService.showSpinner.next(false);
            this.snackbarService.showSnackbar(
              'Task deleted SUccessfully!',
              null,
              3000
            );
          },
          error: (error) => {
            this.spinnerService.showSpinner.next(false);
            this.snackbarService.showSnackbar(
              'Oops, some error occurred. Please try again!',
              null,
              3000
            );
          },
        });
      }
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
  todoService = inject(TodoService);
  spinnerService = inject(SpinnerService);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<DialogAddTaskComponent>);
  data = inject(MAT_DIALOG_DATA);
  snackbarService = inject(SnackbarService);
  broadcast = inject(BroadcasterService);

  constructor() {}

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
    this.spinnerService.showSpinner.next(true);
    this.todoService.addTaskToDatabase(this.toDoForm.value).subscribe({
      next: (response) => {
        this.broadcast.broadcast('reloadList', {});
        this.snackbarService.showSnackbar('Task Created!', null, 3000);
      },
      error: (error) => {
        this.snackbarService.showSnackbar(
          'Oops, some error occurred. Please try again!',
          null,
          3000
        );
      },
    });
  }

  onNoClick() {
    this.dialogRef.close();
    this.toDoForm.reset();
  }

  updateTask() {
    this.spinnerService.showSpinner.next(true);
    const payload = {
      id: this.taskId,
      taskData: this.toDoForm.value,
    };
    this.toDoForm.reset();
    this.todoService.updateTask(payload).subscribe({
      next: (response) => {
        this.broadcast.broadcast('reloadList', {});
        this.broadcast.broadcast('updateTask', { status: 'success' });
        this.snackbarService.showSnackbar('Task Updated!', null, 3000);
        this.spinnerService.showSpinner.next(false);
      },
      error: (error) => {
        this.snackbarService.showSnackbar(
          'Oops, some error occurred. Please try again!',
          null,
          3000
        );
      },
    });
  }
}

@Component({
  selector: 'dialog-delete-task',
  templateUrl: './dialog-delete-task.component.html',
  imports: [MatDialogModule, MatButtonModule],
  standalone: true,
})
export class DialogDeleteTaskComponent {
  dialogRef = inject(MatDialogRef<DialogDeleteTaskComponent>);
  data = inject(MAT_DIALOG_DATA);
  constructor() {}
}
