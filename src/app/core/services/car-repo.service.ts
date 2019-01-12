import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, range } from 'rxjs';
import { CarModel } from '../models/car.model';
import { ContractService } from './contract.service';
import { mergeMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarRepoService {
  carArray: CarModel[] = [];
  carArray$: BehaviorSubject<CarModel[]>;

  constructor(
    private contractService: ContractService
  ) {
    // this.updateCars();
    this.carArray$ = new BehaviorSubject<CarModel[]>([]);
    this.contractService.onAddCar().subscribe((idx) => {
      this.addCar(idx);
    });
    this.contractService.onUpdateCar().subscribe((idx) => {
      this.updateCarByIdx(idx);
    });
  }

  getAllCars(): Observable<CarModel[]> {
    return this.carArray$.asObservable();
  }

  addCar(idx: number) {
    this.contractService.getCarByIdx(idx).subscribe((car) => {
      if (this.carArray.length === idx) {
        this.carArray.push(car);
      } else {
        console.log(this.carArray.length, idx);
      }
      console.log(this.carArray);
      this.carArray$.next(this.carArray);
    });
  }
  updateCars() {
    const tmpCarArray: CarModel[] = [];
    // this.carArray = [];
    this.contractService.getNumCars().pipe(
      mergeMap((number) => range(0, number)),
      mergeMap((idx) => {
        // console.log(idx);
        return this.contractService.getCarByIdx(idx);
      }),
      map((car) => tmpCarArray.push(car))
    ).subscribe(() => {
      this.carArray = tmpCarArray;
      this.carArray$.next(this.carArray);
    });
  }

  updateCarByIdx(idx: number) {
    if (idx < this.carArray.length) {
      this.contractService.getCarByIdx(idx).subscribe((car) => {
        this.carArray[idx] = car;
        this.carArray$.next(this.carArray);
      });
    }
  }

}
