import { Component, OnInit, Inject } from '@angular/core';
import { CarModel } from 'src/app/core/models/car.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/core/services/contract.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-car-detail-popover',
  templateUrl: './car-detail-popover.component.html',
  styleUrls: ['./car-detail-popover.component.scss']
})
export class CarDetailPopoverComponent implements OnInit {
  id: number;
  car: CarModel = new CarModel();
  address: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.id = parseInt(this.data.id, 10);
    this.updateCar();
    this.contractService.getcurrentAddress().subscribe((address) => {
      this.address = address;
    });
    // this.route.paramMap.subscribe((paramMap) => {
    //   this.id = parseInt(paramMap.get('id'), 10);
    //   this.updateCar();
    // });
  }

  private updateCar() {
    this.contractService.getCarByIdx(this.id).subscribe((car) => {
      console.log(car);
      this.car = car;
    });
  }

  shouldDisable(target: string): boolean {
    if (target === 'Rent') {
      return this.car.ownerAddr === this.car.renterAddr && this.car.ownerAddr !== this.address;
    } else {
      return this.car.renterAddr === this.address && this.car.ownerAddr !== this.address;
    }
  }

  onRent() {
    this.contractService.rentCarByIdx(this.car.id).subscribe(() => {
      this.updateCar();
    });
  }

  onReturn() {
    this.contractService.returnCarByIdx(this.car.id).subscribe(() => {
      this.updateCar();
    });
  }

}
