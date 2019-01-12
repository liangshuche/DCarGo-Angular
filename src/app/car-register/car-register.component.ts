import { Component, OnInit } from '@angular/core';
import { CarModel } from '../core/models/car.model';
import { CarTypeEnum } from '../core/enums/car-type.enum';
import { ContractService } from '../core/services/contract.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-car-register',
    templateUrl: './car-register.component.html',
    styleUrls: ['./car-register.component.scss']
})
export class CarRegisterComponent implements OnInit {
    carInput: CarModel = new CarModel();
    carTypeOptions: string[] = Object.keys(CarTypeEnum).filter((key) => isNaN(parseInt(key, 10)));
    registerForm: FormGroup;

    constructor(
        private contractService: ContractService
    ) { }

    ngOnInit() {
        console.log(this.carTypeOptions);
        this.registerForm = new FormGroup({
            age: new FormControl('', [Validators.required, Validators.max(100)])
        });
    }

    onRegister() {
        if (this.carInput.name && CarTypeEnum[this.carInput.type] > -1 &&
            this.carInput.age && this.carInput.price &&
            this.carInput.age < 255 && this.carInput.price < 2000) {
            // this.carInput.xLocate = 0;
            // this.carInput.yLocate = 0;
            this.contractService.rentOutCar(this.carInput).subscribe();
        } else {
            this.carInput = new CarModel();
        }
    }

    hasError(field: string, value: string): boolean {
        console.log(this.registerForm.controls[field].hasError(value));
        return this.registerForm.controls[field].hasError(value);
    }


}
