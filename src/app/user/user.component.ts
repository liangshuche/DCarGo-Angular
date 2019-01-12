import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RegisterPopoverComponent } from './register-popover/register-popover.component';
import { MatDialog } from '@angular/material';
import { ContractService } from '../core/services/contract.service';
import { tap, mergeMap, map, filter } from 'rxjs/operators';
import { CarRepoService } from '../core/services/car-repo.service';
import { CarModel } from '../core/models/car.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userAddress: string;
  userAddressStripped: string;
  userName: string = '';
  carArray: CarModel[] = [];

  numOwned: number = 0;
  numRented: number = 0;
  numRentedOut: number = 0;
  constructor(
    private dialog: MatDialog,
    private contractService: ContractService,
    private carRepoService: CarRepoService,
  ) { }

  ngOnInit() {
    this.updateUser();
  //   this.carRepoService.updateCars();
    this.carRepoService.getAllCars().subscribe((cars) => {
      this.carArray = cars;
      this.updateCarCount();
    });
  // }

  // updateList(cars: CarModel[]) {
  //   this.contractService.getcurrentAddress().subscribe((address) => {
  //     this.carArray = cars.filter(car => car.renterAddr === address);
  //   });
  }

  updateCarCount() {
    this.numOwned = this.carArray.filter(car => car.ownerAddr === this.userAddress).length;
    this.numRented = this.carArray.filter(car => car.renterAddr === this.userAddress).length - this.numOwned;
    this.numRentedOut = this.carArray.filter(car => car.ownerAddr === this.userAddress && car.renterAddr !== car.ownerAddr).length;
  }

  updateUser() {
    this.contractService.getcurrentAddress().subscribe((address) => {
      this.userAddress = address;
      this.userAddressStripped = this.userAddress.substr(0, 16) + '...';
      this.updateCarCount();
    });

    this.contractService.getCurrentName().subscribe((name) => {
      this.userName = name;
    });
  }

  onClickRegister() {
    const registerDialogRef = this.dialog.open(RegisterPopoverComponent);
    registerDialogRef.afterClosed().subscribe(() => {
      console.log('updating');
      this.updateUser();
    });
  }

}
