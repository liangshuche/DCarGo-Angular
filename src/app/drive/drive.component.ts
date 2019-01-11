import { Component, OnInit } from '@angular/core';
import { ContractService } from '../core/services/contract.service';
import { LocationModel } from '../core/models/location.model';
import { LocationService } from '../core/services/location.service';
import { CarModel } from '../core/models/car.model';
import { CarRepoService } from '../core/services/car-repo.service';
import { mergeMap } from 'rxjs/operators';
import { zip } from 'rxjs';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit {
  targetLocation: LocationModel = new LocationModel();
  carArray: CarModel[] = [];
  selectedIdx: number;

  mapLatitude: number = 25.019312;
  mapLongitude: number = 121.542274;
  mapZoom: number = 12;

  constructor(
    private contractService: ContractService,
    private locationService: LocationService,
    private carRepoService: CarRepoService
  ) { }

  ngOnInit() {
    // this.targetLocation.geoLatitude = 25.019312;
    // this.targetLocation.geoLongitude = 121.542274;
    this.carRepoService.updateCars();
    // zip(this.contractService.getcurrentAddress(), this.carRepoService.getAllCars()).subscribe((result) => {
    //   console.log(result);
    //   this.carArray = result[1].filter(car => car.renterAddr === result[0]);
    // });
    this.carRepoService.getAllCars().subscribe((cars) => {
      this.updateList(cars);
    });
  }

  updateList(cars: CarModel[]) {
    this.contractService.getcurrentAddress().subscribe((address) => {
      this.carArray = cars.filter(car => car.renterAddr === address);
    });
  }

  onClickMap(ev, info) {
    if (this.selectedIdx > -1) {
      this.targetLocation.geoLatitude = ev.coords.lat;
      this.targetLocation.geoLongitude = ev.coords.lng;
      info.open();
    }
  }

  onClickDrive() {
    this.targetLocation = this.locationService.geoToInt(this.targetLocation);
    this.contractService.changeLocation(
      this.carArray[this.selectedIdx].id,
      this.targetLocation.intLongitude,
      this.targetLocation.intLatitude).subscribe(() => {
      this.carRepoService.updateCarByIdx(this.selectedIdx);
    });
  }

  onClickList(i) {
    this.selectedIdx = i;
    console.log(this.carArray[this.selectedIdx].location);
    this.mapLatitude = this.carArray[this.selectedIdx].location.geoLatitude;
    this.mapLongitude = this.carArray[this.selectedIdx].location.geoLongitude;
    this.targetLocation.geoLatitude = this.carArray[this.selectedIdx].location.geoLatitude;
    this.targetLocation.geoLongitude = this.carArray[this.selectedIdx].location.geoLongitude;
    this.mapZoom = 13;
  }

}
