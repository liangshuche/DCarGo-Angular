import { Component, OnInit } from '@angular/core';
import { CarModel } from '../core/models/car.model';
import { ContractService } from '../core/services/contract.service';
import { map, mergeMap } from 'rxjs/operators';
import { range } from 'rxjs';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {
  carArray: CarModel[] = [];
  constructor(
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.contractService.getNumCars().pipe(
      mergeMap((number) => range(0, number)),
      mergeMap((idx) => {
        console.log(idx);
        return this.contractService.getCarByIdx(idx);
      }),
      map((car) => this.carArray.push(car))
    ).subscribe();

  }

}
