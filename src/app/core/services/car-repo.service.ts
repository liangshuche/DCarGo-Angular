import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, range } from 'rxjs';
import { CarModel } from '../models/car.model';
import { ContractService } from './contract.service';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarRepoService {
  carArray: CarModel[];
  carArray$: BehaviorSubject<CarModel[]>;

  constructor(
    private contractService: ContractService
  ) {
    this.carArray$ = new BehaviorSubject<CarModel[]>([]);
  }

  getAllCars(): Observable<CarModel[]> {
    return this.carArray$.asObservable();
  }

  updateCars() {
    this.carArray = [];
    this.contractService.getNumCars().pipe(
      mergeMap((number) => range(0, number)),
      mergeMap((idx) => {
        console.log(idx);
        return this.contractService.getCarByIdx(idx);
      }),
      map((car) => this.carArray.push(car))
    ).subscribe(() => {
      this.carArray$.next(this.carArray);
    });
  }

}
