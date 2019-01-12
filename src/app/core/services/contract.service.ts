import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable, from, of, merge, Subject } from 'rxjs';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';
import { CarModel } from '../models/car.model';
import { CarTypeEnum } from '../enums/car-type.enum';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
import { LocationModel } from '../models/location.model';
import { LocationService } from './location.service';
// import * as TruffleContract from 'truffle-contract';
declare let require: any;
declare let window: any;

const tokenAbi = require('../../../../solidity/build/ABI.json');

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private web3: Web3;
  private contract: any;
  private contractAddress: string = '0x6b0b9c3d7eabc3737c66e8925dfa917e87d9db5c';
  private currentAddress: string;
  private currentName: string;
  private spinnerRef: MatDialogRef<SpinnerComponent>;

  private addCarSubject: Subject<number>;
  private updateCarSubject: Subject<number>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private locationService: LocationService,
  ) {
    if (typeof window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      console.log(this.web3);
    } else {
      // this.web3Provider =b new Web3.providers.HttpProvider('')
      console.log('error');
    }

    this.addCarSubject = new Subject<number>();
    this.updateCarSubject = new Subject<number>();

    this.contract = new this.web3.eth.Contract(tokenAbi, this.contractAddress);

    this.contract.events.NewCar((error, result) => {
        this.addCarSubject.next(result.returnValues.idx);
        this.delay(200).then(() => {
            this.snackBar.open('New Car Added', 'Dismiss', {
                duration: 2000,
            });
        });
        console.log(result.returnValues);
    });

    this.contract.events.RentCar((error, result) => {
        this.updateCarSubject.next(result.returnValues.carId);
        this.delay(100);
        this.snackBar.open(result.returnValues.owner + '\'s car is rented by ' + result.returnValues.renter, 'Dismiss', {
            duration: 2000,
        });
    });
  }

// #################### Observables ###################

    onAddCar(): Observable<number> {
        return this.addCarSubject.asObservable();
    }

    onUpdateCar(): Observable<number> {
        return this.updateCarSubject.asObservable();
    }

// ###################### GETTER ######################

    getcurrentAddress(): Observable<string> {
        if (this.currentAddress) {
            return of(this.currentAddress);
        } else {
            return from(this.web3.eth.getAccounts()).pipe(
                map((accounts) => {
                this.currentAddress = accounts[0];
                return accounts[0];
                })
            );
        }
    }

    getCurrentName(): Observable<string> {
        if (this.currentName) {
            return of(this.currentName);
        } else {
            return this.getcurrentAddress().pipe(
                mergeMap((address) => {
                    return from(this.contract.methods.getNameByAddress(address).call());
                })
            );
        }
    }

    getNumCars(): Observable<number> {
        return from(this.contract.methods.getLength().call());
    }

    getCarByIdx(idx: number): Observable<CarModel> {
        return this.getNumCars().pipe(
            mergeMap(() => {
                return from(this.contract.methods.cars(idx).call());
            }),
            map((result: any) => {
                return {
                    name: result.name,
                    type: CarTypeEnum[parseInt(result.cartype, 10)],
                    age: result.age,
                    price: result.price,
                    location: this.locationService.createLocation(parseInt(result.xlocate, 10), parseInt(result.ylocate, 10)),
                    id: idx,
                    oil: result.oil,
                    damage: result.damage,
                    rentTime: result.rentTime,
                    ownerAddr: result.owner,
                    ownerName: '',
                    renterAddr: result.renter,
                    renterName: '',
                    rented: result.owner !== result.renter
                } as CarModel;
            })
        );
    }


// ###################### SETTER ######################

    registerUserName(name: string): Observable<string> {
        return this.getcurrentAddress().pipe(
            tap((address) => {this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.contract.methods.enroll(name).send({from: address}));
            }),
            tap(() => this.spinnerRef.close()),
            catchError((err) => {
                console.log(err);
                this.spinnerRef.close();
                // this.dialog.closeAll();
                return of(null);
            })
        );
    }



    rentCarByIdx(idx: number): Observable<string> {
        return this.getcurrentAddress().pipe(
            tap((address) => {this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.contract.methods.rentCar(idx).send({from: address}));
            }),
            tap(() => this.spinnerRef.close()),
            catchError((err) => {
                console.log(err);
                this.spinnerRef.close();
                // this.dialog.closeAll();
                return of(null);
            })
        );
    }

    returnCarByIdx(idx: number): Observable<string> {
        return this.getcurrentAddress().pipe(
            tap((address) => {this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.contract.methods.returnCar(idx).send({from: address}));
            }),
            tap(() => this.spinnerRef.close()),
            catchError((err) => {
                console.log(err);
                this.spinnerRef.close();
                // this.dialog.closeAll();
                return of(null);
            })
        );
    }

    rentOutCar(car: CarModel): Observable<string> {
        console.log(car);
        return this.getcurrentAddress().pipe(
            tap((address) => { this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.contract.methods.addCar(car.name, CarTypeEnum[car.type], car.age, car.price, 0, 0).send({from: address}));
            }),
            tap(() => this.spinnerRef.close()),
            catchError((err) => {
                console.log(err);
                this.spinnerRef.close();
                // this.dialog.closeAll();
                return of(null);
            })
        );
    }

    changeLocation(id: number, xLocate: number, yLocate: number): Observable<string> {
        return this.getcurrentAddress().pipe(
            tap((address) => { this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.contract.methods.changeLocation(id, xLocate, yLocate).send({from: address}));
            }),
            tap(() => this.spinnerRef.close()),
            catchError((err) => {
                console.log(err);
                this.spinnerRef.close();
                return of(null);
            })
        );
    }

// ###################### Private ######################

    private presentSpinner() {
        this.spinnerRef = this.dialog.open(SpinnerComponent, {
            disableClose: true,
        });
    }

    private async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms));
    }

}
