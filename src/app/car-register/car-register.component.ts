import { Component, OnInit } from '@angular/core';
import { CarModel } from '../core/models/car.model';
import { CarTypeEnum } from '../core/enums/car-type.enum';
import { ContractService } from '../core/services/contract.service';

@Component({
  selector: 'app-car-register',
  templateUrl: './car-register.component.html',
  styleUrls: ['./car-register.component.scss']
})
export class CarRegisterComponent implements OnInit {
  carInput: CarModel = new CarModel();
  carTypeOptions: string[] = Object.values(CarTypeEnum);
  constructor(
    private contractService: ContractService
  ) { }

  ngOnInit() {
    console.log(this.carTypeOptions);
  }

  onRegister() {
    this.carInput.xLocate = 0;
    this.carInput.yLocate = 0;
    console.log(this.carInput);
    for (const key in Object.keys(this.carInput)) {
      if (!key) {
        console.log('error');
        return;
      }
    }
    this.contractService.rentOutCar(this.carInput);
  }

}
