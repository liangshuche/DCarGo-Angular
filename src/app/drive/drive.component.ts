import { Component, OnInit } from '@angular/core';
import { ContractService } from '../core/services/contract.service';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {
  targetLatitude: number = 25.019312;
  targetLongitude: number = 121.542274;
  constructor(
    private contractService: ContractService
  ) { }

  ngOnInit() {
  }

  onClickMap(ev) {
    console.log(ev);
    this.targetLatitude = ev.coords.lat;
    this.targetLongitude = ev.coords.lng;
    this.contractService.changeLocation(0, this.targetLatitude, this.targetLongitude).subscribe();
  }

}
