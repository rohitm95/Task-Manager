import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.scss'
})
export class DeleteTaskComponent {
  dialogRef = inject(MatDialogRef<DeleteTaskComponent>);
  data = inject(MAT_DIALOG_DATA);
}
