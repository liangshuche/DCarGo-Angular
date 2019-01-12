import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { NotificationCenterComponent } from 'src/app/shared/notification-center/notification-center.component';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  ref: MatDialogRef<NotificationCenterComponent>;
  notifications: string[] = [];
  notificationsSubject: Subject<null>;
  eventHistoryMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private dialog: MatDialog
  ) {
    this.notificationsSubject = new Subject<null>();
  }

  onPushNotification(): Observable<string> {
    return this.notificationsSubject.asObservable();
  }

  pushNotification(event: string, from: string, to: string, carId: number, eventId: string) {
    if (!this.eventHistoryMap.get(eventId)) {
      this.eventHistoryMap.set(eventId, true);
      this.notificationsSubject.next();
      switch (event) {
        case 'add': {
          this.notifications.unshift(from + ' registered a new car available for rent');
          break;
        }
        case 'rent': {
          this.notifications.unshift(from + ' rented a car from ' + to);
          break;
        }
        case 'return': {
          this.notifications.unshift(from + ' return the car to ' + to);
          break;
        }
        case 'crash': {
          this.notifications.unshift(from + ' crashed his/her car');
          break;
        }
        default: {
          console.warn('No such event', event);
        }
      }
      // console.log(event, from, to, carId);
    }
    // console.log(event, from, to, carId);
  }

  presentNotifications(numNotifications: number) {
    console.log('present');
    this.ref = this.dialog.open(NotificationCenterComponent, {
      data: {
        logs: this.notifications,
        numNotifications: numNotifications
        // numNotifications: 2
      },
      autoFocus: false,
      position: {
        right: '0px',
        top: '70px',
      },
      width: '400px',
      height: '400px'
    });
  }
}
