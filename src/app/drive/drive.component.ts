import { Component, OnInit } from '@angular/core';
import { ContractService } from '../core/services/contract.service';
import { LocationModel } from '../core/models/location.model';
import { LocationService } from '../core/services/location.service';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {
  targetLocation: LocationModel = new LocationModel();
  constructor(
    private contractService: ContractService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.targetLocation.geoLatitude = 25.019312;
    this.targetLocation.geoLongitude = 121.542274;
  }

  onClickMap(ev) {
    console.log(ev);
    this.targetLocation.geoLatitude = ev.coords.lat;
    this.targetLocation.geoLongitude = ev.coords.lng;
    this.targetLocation = this.locationService.geoToInt(this.targetLocation);
    this.contractService.changeLocation(0, this.targetLocation.intLongitude, this.targetLocation.intLatitude).subscribe();
  }

}
