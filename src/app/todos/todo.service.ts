import { Injectable, inject } from '@angular/core';
import { Todo } from './todo.model';
import { asyncScheduler, scheduled } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class TodoService {
  docRef;
  private userId;
  snackbarService = inject(SnackbarService);
  broadcast = inject(BroadcasterService);
  fireStore = inject(Firestore);

  fetchUserTasks(userId: string) {
    this.userId = userId;
    const userTasksQuery = query(
      collection(this.fireStore, 'availableTasks'),
      where('userId', '==', userId)
    );
    return scheduled(getDocs(userTasksQuery), asyncScheduler);
  }

  // fetchAvailableTasks() {
  //   const availableTasksCollection = scheduled(
  //     getDocs(collection(this.fireStore, 'availableTasks'), asyncScheduler)
  //   );
  // return availableTasksCollection
  // }

  addTaskToDatabase(task: Todo) {
    let newTask = {
      ...task,
      date: new Date().toISOString(),
      userId: this.userId,
    };
    return scheduled(
      addDoc(collection(this.fireStore, 'availableTasks'), newTask),
      asyncScheduler
    );
  }

  updateTask(task) {
    this.docRef = doc(this.fireStore, 'availableTasks', task.id);

    const data = {
      title: task.taskData.title,
      description: task.taskData.description,
      status: task.taskData.status,
    };

    return scheduled(updateDoc(this.docRef, data), asyncScheduler);
  }

  deleteTask(id) {
    this.docRef = doc(this.fireStore, 'availableTasks', id);
    return scheduled(deleteDoc(this.docRef), asyncScheduler);
  }

  getTask(id) {
    this.docRef = doc(this.fireStore, 'availableTasks', id);

    return scheduled(getDoc(this.docRef), asyncScheduler);
  }
}
