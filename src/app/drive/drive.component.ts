import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContractService } from '../core/services/contract.service';
import { LocationModel } from '../core/models/location.model';
import { LocationService } from '../core/services/location.service';
import { CarModel } from '../core/models/car.model';
import { CarRepoService } from '../core/services/car-repo.service';
import { mergeMap, tap, takeUntil } from 'rxjs/operators';
import { zip, of, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.scss']
})
export class DriveComponent implements OnInit, OnDestroy {
  contract;
  eventHistoryMap: Map<string, boolean> = new Map<string, boolean>();
  private ngUnsubscribe = new Subject();

  targetLocation: LocationModel = new LocationModel();
  carArray: CarModel[] = [];
  selectedIdx: number = -1;

  mapLatitude: number = 25.0343;
  mapLongitude: number = 121.532;
  mapZoom: number = 13;

  constructor(
    private contractService: ContractService,
    private locationService: LocationService,
    private carRepoService: CarRepoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.contract = this.contractService.getContract();

    this.contractService.updateCurrentAddress().subscribe();

    this.contractService.onCrashEvent().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((carId) => {
      if (carId === this.carArray[this.selectedIdx].id) {
        this.snackBar.open('Oops! You Crashed Your Car', 'Dismiss', {
          duration: 2000,
        });
      }
    });

    this.contractService.onTimeExpired().pipe(
      takeUntil(this.ngUnsubscribe)
      ).subscribe((carId) => {
        if (carId === this.carArray[this.selectedIdx].id) {
          this.snackBar.open('Rental Time Has Expired', 'Dismiss', {
            duration: 2000,
          });
          this.targetLocation.geoLatitude = this.carArray[this.selectedIdx].location.geoLatitude;
          this.targetLocation.geoLongitude = this.carArray[this.selectedIdx].location.geoLongitude;
        }
    });

    this.carRepoService.getAllCars().subscribe((cars) => {
      this.updateList(cars);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateList(cars: CarModel[]) {
    this.contractService.getcurrentAddress().subscribe((address) => {
      // console.log(cars);
      this.carArray = cars.filter(car => car.renterAddr === address);
    });
  }

  onClickMap(ev, info) {
    if (this.selectedIdx > -1 &&
        ev.coords.lat >= 24.9968 && ev.coords.lat < 25.0718 &&
        ev.coords.lng >= 121.457 && ev.coords.lng < 121.607) {
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
      // this.targetLocation.intLatitude).pipe(
      //   mergeMap(() => {
      //     if (Math.random() < 0.5) {
      //       return this.contractService.createCrash(this.carArray[this.selectedIdx].id, 100);
      //     } else {
      //       return of('');
      //     }
      //   })
      // ).subscribe(() => {
      //   this.carRepoService.updateCarByIdx(this.selectedIdx);
      // });
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
