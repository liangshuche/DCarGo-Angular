import { Component, OnInit } from '@angular/core';
import { CarRepoService } from 'src/app/core/services/car-repo.service';
import { ContractService } from 'src/app/core/services/contract.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  registered: boolean;
  // showBadge: boolean = false;
  newNotificationCount: number = 0;
  constructor(
    private carRepoService: CarRepoService,
    private contractService: ContractService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.carRepoService.updateCars();
    this.contractService.getCurrentName().subscribe();
    this.contractService.onRegisterEvent().subscribe((value) => {
      this.registered = value;
    });
    this.notificationService.onPushNotification().subscribe(() => {
      // this.showBadge = true;
      this.newNotificationCount += 1;
    });
  }

  onClick() {
    this.notificationService.presentNotifications(this.newNotificationCount);
    this.newNotificationCount = 0;
  }

}
