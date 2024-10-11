import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { SpinnerService } from '../../shared/spinner.service';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-add-task',
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
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
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
  dialogRef = inject(MatDialogRef<AddTaskComponent>);
  data = inject(MAT_DIALOG_DATA);
  snackbarService = inject(SnackbarService);
  broadcast = inject(BroadcasterService);

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
    this.spinnerService.showSpinner(true);
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
    this.spinnerService.showSpinner(true);
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
        this.spinnerService.showSpinner(false);
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
