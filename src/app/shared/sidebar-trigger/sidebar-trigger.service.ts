import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarTriggerService {
  private _trigger = new Subject<void>();
  trigger$ = this._trigger.asObservable();

  triggerRerender() {
    this._trigger.next();
  }
}
