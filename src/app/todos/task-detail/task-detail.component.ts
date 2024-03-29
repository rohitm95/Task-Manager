import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  constructor(
    public router: Router,
    private todoService: TodoService,
    private broadcast: BroadcasterService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.taskId = window.history.state.key;
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
    this.subscription = this.todoService.showSpinner.subscribe((response) => {
      this.isLoadingResults = response;
    });
  }

  goBack() {
    this.router.navigate(['/todo-list']);
  }

  getTaskData() {
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
      this.todoService.showSpinner.next(true);
      this.todoService.deleteTask(this.taskId);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
