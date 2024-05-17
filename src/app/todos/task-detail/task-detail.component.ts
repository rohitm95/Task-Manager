import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TodoService } from '../todo.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogAddTaskComponent,
  DialogDeleteTaskComponent,
} from '../list/list.component';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../../shared/spinner.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatProgressSpinner],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  taskId = '';
  taskDetails;
  isLoadingResults = true;
  subscription: Subscription;
  spinnerService = inject(SpinnerService);
  router = inject(Router);
  todoService = inject(TodoService);
  broadcast = inject(BroadcasterService);
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);

  constructor() {}

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

    this.subscription = this.spinnerService.showSpinner.subscribe(
      (response) => {
        this.isLoadingResults = response;
      }
    );
  }

  goBack() {
    this.router.navigate(['/todo-list']);
  }

  getTaskData() {
    this.spinnerService.showSpinner.next(true);
    this.todoService.getTask(this.taskId);
  }

  editTask() {
    this.dialog.open(DialogAddTaskComponent, {
      data: { result: this.taskDetails, editMode: true, id: this.taskId },
    });
  }

  deleteTask() {
    const dialogRef = this.dialog.open(DialogDeleteTaskComponent);
    dialogRef.afterClosed().subscribe((response) => {
      this.spinnerService.showSpinner.next(true);
      this.todoService.deleteTask(this.taskId);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
