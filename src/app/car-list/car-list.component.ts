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
import { MarkerManager } from '@agm/core';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  lat: number = 51.678418;
  lng: number = 7.809007;
  carArray: CarModel[] = [];
  filter: string = 'all';
  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private carRepoService: CarRepoService,
    private locationSerivce: LocationService,
    private ref: ChangeDetectorRef,
    // private markerManager: MarkerManager,
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

  shouldDisplay(car: CarModel): boolean {
    if (this.filter === 'all') {
      return true;
    } else if (this.filter === 'available') {
      return false;
    } else {
      return false;
    }
  }

}
