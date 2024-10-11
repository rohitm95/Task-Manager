import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TodoService } from '../todo.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../../shared/spinner.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddTaskComponent } from '../add-task/add-task.component';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit {
  taskId = '';
  taskDetails;
  isLoadingResults;
  spinnerService = inject(SpinnerService);
  router = inject(Router);
  todoService = inject(TodoService);
  broadcast = inject(BroadcasterService);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  snackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.taskId = params['id'];
    });

    this.getTaskData();

    this.broadcast.recieve('taskDetail', (response) => {
      this.taskDetails = response.data;
    });

    this.broadcast.recieve('updateTask', () => {
      this.getTaskData();
    });

    this.broadcast.recieve('deleteTask', () => {
      this.router.navigate(['/todo-list']);
    });

    this.isLoadingResults = this.spinnerService.showSpinner$;
  }

  goBack() {
    this.router.navigate(['/todo-list']);
  }

  getTaskData() {
    this.spinnerService.showSpinner(true);
    this.todoService.getTask(this.taskId).subscribe({
      next: (response) => {
        if (response.exists()) {
          this.broadcast.broadcast('taskDetail', { data: response.data() });
          this.spinnerService.showSpinner(false);
        } else {
          this.snackbarService.showSnackbar(
            'Document does not exist',
            null,
            3000
          );
          this.spinnerService.showSpinner(false);
        }
      },
      error: (error) => {
        console.error('Error getting document:', error);
        this.snackbarService.showSnackbar(
          'Error getting document, try again',
          null,
          3000
        );
        this.spinnerService.showSpinner(false);
      },
    });
  }

  editTask() {
    this.dialog.open(AddTaskComponent, {
      data: { result: this.taskDetails, editMode: true, id: this.taskId },
    });
  }

  deleteTask() {
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      data: this.taskDetails,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.spinnerService.showSpinner(true);
        this.todoService.deleteTask(this.taskId).subscribe({
          next: (response) => {
            this.router.navigate(['/todo-list']);
            this.snackbarService.showSnackbar(
              'Task deleted Successfully!',
              null,
              3000
            );
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
    });
  }
}
