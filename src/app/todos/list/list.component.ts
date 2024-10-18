import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';
import { BroadcasterService } from '../../shared/broadcaster.service';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { SpinnerService } from '../../shared/spinner.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AddTaskComponent } from '../add-task/add-task.component';
import { DeleteTaskComponent } from '../delete-task/delete-task.component';

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
    MatPaginatorModule,
    AsyncPipe,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['title', 'status', 'created', 'actions'];
  dataSource;
  data: Todo[] = [];
  isLoadingResults;
  spinnerService = inject(SpinnerService);
  auth = inject(Auth);
  dialog = inject(MatDialog);
  todoService = inject(TodoService);
  broadcast = inject(BroadcasterService);
  router = inject(Router);
  authState$ = authState(this.auth);
  snackbarService = inject(SnackbarService);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.broadcast.recieve('reloadList', () => {
      this.getTaskList();
    });

    this.isLoadingResults = this.spinnerService.showSpinner$;
    this.getTaskList();
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
            this.dataSource = new MatTableDataSource<Todo>(availableTasks);
            this.data = availableTasks;
            setTimeout(() => {
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            });
            this.spinnerService.showSpinner(false);
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
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  viewTask(id) {
    this.router.navigate(['/todo', id]);
  }

  deleteTask(id) {
    let result = this.data.find((task) => task.id == id);
    const dialogRef = this.dialog.open(DeleteTaskComponent, {
      data: result,
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.spinnerService.showSpinner(true);
        this.todoService.deleteTask(id).subscribe({
          next: (response) => {
            this.broadcast.broadcast('reloadList', {});
            this.broadcast.broadcast('deleteTask', { status: 'success' });
            this.spinnerService.showSpinner(false);
            this.snackbarService.showSnackbar(
              'Task deleted SUccessfully!',
              null,
              3000
            );
          },
          error: (error) => {
            this.spinnerService.showSpinner(false);
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
    this.dialog.open(AddTaskComponent, {
      data: { result: result, editMode: true },
    });
  }

  addNewTask() {
    this.dialog.open(AddTaskComponent, {
      data: { editMode: false },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
