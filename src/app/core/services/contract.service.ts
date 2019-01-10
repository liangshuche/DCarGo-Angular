import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable, from, of, merge, Subject } from 'rxjs';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';
import { CarModel } from '../models/car.model';
import { CarTypeEnum } from '../enums/car-type.enum';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
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
  private contractAddress: string = '0x4369d6715dec2ad757249ea0f9b59281e472a8b1';
  private currentAddress: string;
  private currentName: string;
  private spinnerRef: MatDialogRef<SpinnerComponent>;

  private addCarSubject: Subject<number>;

  constructor(
    private dialog: MatDialog
  ) {
    if (typeof window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      console.log(this.web3);
    } else {
      // this.web3Provider =b new Web3.providers.HttpProvider('')
      console.log('error');
    }
    this.addCarSubject = new Subject<number>();
    this.contract = new this.web3.eth.Contract(tokenAbi, this.contractAddress);
    this.contract.events.NewCar((error, result) => {
        console.log(result.returnValues);
        this.addCarSubject.next(result.returnValues.idx);
    });

  }

// #################### Observables ###################

    onAddCar(): Observable<number> {
        return this.addCarSubject.asObservable();
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
                    type: result.type,
                    age: result.age,
                    price: result.price,
                    xLocate: result.xLocate,
                    yLocate: result.yLocate,
                    id: idx,
                    oil: result.oil,
                    ownerAddr: result.owner,
                    renterAddr: result.renter
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
                return from(this.contract.methods.addCar(car.name, car.type, car.age, car.price, 0, 0).send({from: address}));
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

}
