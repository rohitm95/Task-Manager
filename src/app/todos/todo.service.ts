import { Injectable, inject } from '@angular/core';
import { Todo } from './todo.model';
import { Subject, from } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { SnackbarService } from '../shared/snackbar.service';
import { BroadcasterService } from '../shared/broadcaster.service';
import { SpinnerService } from '../shared/spinner.service';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private availableTasks: Todo[] = [];
  docRef;
  private spinnerService = inject(SpinnerService);
  private userId;
  constructor(
    private snackbarService: SnackbarService,
    private broadcast: BroadcasterService,
    public fireStore: Firestore
  ) {}

  fetchUserTasks(userId: string) {
    this.userId = userId;
    const userTasksQuery = query(
      collection(this.fireStore, 'availableTasks'),
      where('userId', '==', userId)
    );

    const userTasksCollection = from(getDocs(userTasksQuery));

    userTasksCollection.subscribe({
      next: (querySnapshot) => {
        let docs = querySnapshot.docs;
        this.availableTasks = docs.map((doc) => {
          return {
            id: doc.id,
            title: doc.data()['title'],
            description: doc.data()['description'],
            status: doc.data()['status'],
            date: doc.data()['date'],
          };
        });
        this.broadcast.broadcast('availableTasks', {
          tasks: this.availableTasks,
        });
        this.spinnerService.showSpinner.next(false);
      },
      error: (error) => {
        console.error('Error fetching user tasks: ', error);
      },
    });
  }

  // fetchAvailableTasks() {
  //   const availableTasksCollection = from(
  //     getDocs(collection(this.fireStore, 'availableTasks'))
  //   );
  //   availableTasksCollection.subscribe({
  //     next: (querySnapshot) => {
  //       let docs = querySnapshot.docs;
  //       this.availableTasks = docs.map((doc) => {
  //         return {
  //           id: doc.id,
  //           title: doc.data()['title'],
  //           description: doc.data()['description'],
  //           status: doc.data()['status'],
  //           date: doc.data()['date'],
  //         };
  //       });
  //       this.broadcast.broadcast('availableTasks', {
  //         tasks: this.availableTasks,
  //       });
  //       this.spinnerService.showSpinner.next(false);
  //     },
  //     error: (error) => {
  //       this.snackbarService.showSnackbar(
  //         'Fetching tasks failed, please try again later',
  //         null,
  //         3000
  //       );
  //       this.broadcast.broadcast('availableTasks', { tasks: null });
  //     },
  //   });
  // }

  async addTaskToDatabase(task: Todo) {
    let newTask = {
      ...task,
      date: new Date().toISOString(),
      userId: this.userId,
    };
    await addDoc(collection(this.fireStore, 'availableTasks'), newTask)
      .then((response) => {
        this.fetchUserTasks(this.userId);
        this.snackbarService.showSnackbar('Task Created!', null, 3000);
      })
      .catch((error) => {
        this.snackbarService.showSnackbar(
          'Oops, some error occurred. Please try again!',
          null,
          3000
        );
      });
  }

  async updateTask(task) {
    this.docRef = doc(this.fireStore, 'availableTasks', task.id);

    const data = {
      title: task.taskData.title,
      description: task.taskData.description,
      status: task.taskData.status,
    };

    await updateDoc(this.docRef, data)
      .then((response) => {
        this.fetchUserTasks(this.userId);
        this.broadcast.broadcast('updateTask', { status: 'success' });
        this.snackbarService.showSnackbar('Task Updated!', null, 3000);
        this.spinnerService.showSpinner.next(false);
      })
      .catch((error) => {
        this.snackbarService.showSnackbar(
          'Oops, some error occurred. Please try again!',
          null,
          3000
        );
      });
  }

  async deleteTask(id) {
    this.docRef = doc(this.fireStore, 'availableTasks', id);

    await deleteDoc(this.docRef)
      .then((response) => {
        this.fetchUserTasks(this.userId);
        this.broadcast.broadcast('deleteTask', { status: 'success' });
        this.spinnerService.showSpinner.next(false);
        this.snackbarService.showSnackbar(
          'Task deleted SUccessfully!',
          null,
          3000
        );
      })
      .catch((error) => {
        this.snackbarService.showSnackbar(
          'Oops, some error occurred. Please try again!',
          null,
          3000
        );
      });
  }

  async getTask(id) {
    this.docRef = doc(this.fireStore, 'availableTasks', id);
    try {
      const docSnap = await getDoc(this.docRef);
      if (docSnap.exists()) {
        this.broadcast.broadcast('taskDetail', { data: docSnap.data() });
        this.spinnerService.showSpinner.next(false);
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      this.snackbarService.showSnackbar(
        'Error getting document, try again',
        null,
        3000
      );
      this.broadcast.broadcast('taskDetail', { data: null });
      this.spinnerService.showSpinner.next(false);
    }
  }
}
