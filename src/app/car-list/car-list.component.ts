import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CarModel } from '../core/models/car.model';
import { ContractService } from '../core/services/contract.service';
import { map, mergeMap } from 'rxjs/operators';
import { range } from 'rxjs';
import { CarRepoService } from '../core/services/car-repo.service';
import { LocationModel } from '../core/models/location.model';
import { MatDialog } from '@angular/material';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { CarDetailPopoverComponent } from './car-detail-popover/car-detail-popover.component';
import { LocationService } from '../core/services/location.service';
import { MarkerManager, LatLngBounds } from '@agm/core';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;
  prevInfo: any;
  mapBounds = {
    north: 25.0718,
    south: 24.9968,
    west: 121.457,
    east: 121.607
  };
  carArray: CarModel[] = [];
  displayCarArray: CarModel[] = [];
  filter: string = 'all';
  address: string;
  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private carRepoService: CarRepoService,
    private locationSerivce: LocationService,
    private ref: ChangeDetectorRef,
    // private markerManager: MarkerManager,
  ) { }

  ngOnInit() {
    // this.carRepoService.updateCars();
    this.carRepoService.getAllCars().subscribe((cars) => {
      this.carArray = cars;
      this.updateDisplayCarArray();
    });
    this.contractService.getcurrentAddress().subscribe((address) => {
      this.address = address;
    });
  }

  onDragMap(ev) {
    console.log(ev);
  }

  onClickMarker(info) {
    if (this.prevInfo) {
      console.log(this.prevInfo);
      this.prevInfo.close();
    }
    this.prevInfo = info;
  }

  onClickDetail(idx: number) {
    const carDetailDialogRef = this.dialog.open(CarDetailPopoverComponent, {
      data: {
        id: idx,
      },
      autoFocus: false,
      width: '500px',
    });
    // registerDialogRef.afterClosed().pipe(
    //   tap((name) => { console.log(name); }),
    //   mergeMap((name) => {
    //     return this.contractService.registerUserName(name);
    //   })
    // ).subscribe(() => {
    //   this.updateUser();
    // });
  }

  updateDisplayCarArray() {
    if (this.filter === 'all') {
      this.displayCarArray = this.carArray;
    } else if (this.filter === 'available') {
      this.displayCarArray = this.carArray.filter((car) => {
        return car.ownerAddr !== this.address && car.ownerAddr === car.renterAddr;
      });
    } else {
      this.displayCarArray = this.carArray.filter((car) => {
        return car.ownerAddr === this.address || car.renterAddr === this.address;
      });
    }
  }

  onClickRadio(ev) {
    this.filter = ev.value;
    this.updateDisplayCarArray();
  }

}
