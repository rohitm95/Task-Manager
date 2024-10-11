import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, authState, updateProfile } from '@angular/fire/auth';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '../../shared/spinner.service';
import { SnackbarService } from '../../shared/snackbar.service';
import {
  ref,
  uploadBytes,
  Storage,
  getDownloadURL,
} from '@angular/fire/storage';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrl: 'profile.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgOptimizedImage,
    AsyncPipe
  ],
})
export class ProfileComponent implements OnInit {
  auth = inject(Auth);
  authState$ = authState(this.auth);
  profileForm: FormGroup;
  userDetails;
  spinnerService = inject(SpinnerService);
  isLoadingResults;
  storage = inject(Storage);
  snackbarService = inject(SnackbarService);

  ngOnInit() {
    this.authState$.subscribe((user) => {
      this.userDetails = user;
      this.spinnerService.showSpinner(false);
    });

    this.isLoadingResults = this.spinnerService.showSpinner$;
  }

  uploadSelectedFile(event) {
    this.spinnerService.showSpinner(true);
    const file = event.target.files[0];
    const storageURL =
      'https://firebasestorage.googleapis.com/v0/b/to-do-app-3569d.appspot.com/o/profile-images';
    const filePath = `${storageURL}/${file.name}`;
    const storageRef = ref(this.storage, filePath);
    uploadBytes(storageRef, file)
      .then((result) => {
        getDownloadURL(storageRef)
          .then((result) => {
            updateProfile(this.auth.currentUser, {
              photoURL: result.toString(),
            })
              .then(() => {
                this.snackbarService.showSnackbar(
                  'Profile image uploaded!',
                  null,
                  3000
                );
                this.spinnerService.showSpinner(false);
              })
              .catch((err) => {
                console.log(err);
                this.spinnerService.showSpinner(false);
              });
          })
          .catch((error) => {
            this.spinnerService.showSpinner(false);
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        this.spinnerService.showSpinner(false);
      });
  }
}
