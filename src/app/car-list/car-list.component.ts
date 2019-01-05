import { Component, OnInit } from '@angular/core';
import { CarModel } from '../core/models/car.model';
import { ContractService } from '../core/services/contract.service';
import { map, mergeMap } from 'rxjs/operators';
import { range } from 'rxjs';
import { CarRepoService } from '../core/services/car-repo.service';
import { LocationModel } from '../core/models/location.model';
import { MatDialog } from '@angular/material';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { CarDetailPopoverComponent } from './car-detail-popover/car-detail-popover.component';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  carLocations: LocationModel[] = [
    {
      id: 0,
      name: 'first car',
      latitude: 25.0159782,
      longitude: 121.5396341
    },
    {
      id: 1,
      name: 'second car',
      latitude: 25.016000,
      longitude: 121.540000
    },
    {
      id: 2,
      name: 'third car',
      latitude: 25.015800,
      longitude: 121.538000
    }
  ];
  lat: number = 51.678418;
  lng: number = 7.809007;
  carArray: CarModel[] = [];
  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private carRepoService: CarRepoService
  ) { }

  ngOnInit() {
    this.carRepoService.updateCars();
    this.carRepoService.getAllCars().subscribe((cars) => {
      this.carArray = cars;
    });
  }

  onClickDetail(idx: number) {
    const carDetailDialogRef = this.dialog.open(CarDetailPopoverComponent, {
      data: {
        id: idx,
      },
      autoFocus: false,
      width: '600px',
      height: '400px',
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

}
