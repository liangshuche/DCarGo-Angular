import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/core/services/contract.service';
import { mergeMap } from 'rxjs/operators';
import { CarModel } from 'src/app/core/models/car.model';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent implements OnInit {
  id: number;
  car: CarModel = new CarModel();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = parseInt(paramMap.get('id'), 10);
      this.updateCar();
    });
  }

  private updateCar() {
    this.contractService.getCarByIdx(this.id).subscribe((car) => {
      this.car = car;
    });
  }

  // onRent() {
  //   this.contractService.rentCarByIdx(this.car.id).subscribe(() => {
  //     this.updateCar();
  //   });
  // }

  // onReturn() {
  //   this.contractService.returnCarByIdx(this.car.id).subscribe(() => {
  //     this.updateCar();
  //   });
  // }

}
