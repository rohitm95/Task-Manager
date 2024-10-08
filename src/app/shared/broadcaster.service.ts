import { Injectable } from '@angular/core';
import { Subject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BroadcasterService {
  readonly _handler: Subject<Subjects> = new Subject<Subjects>();

  broadcast(name, args) {
    this._handler.next({ name, args });
  }

  recieve(name, listener) {
    return this._handler
      .pipe(
        filter((event) => event.name === name),
        map((event) => event.args)
      )
      .subscribe(listener);
  }
}

interface Subjects {
  name?: string;
  args?: [];
}
