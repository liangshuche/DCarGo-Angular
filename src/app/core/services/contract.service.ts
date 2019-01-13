import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable, from, of, merge, Subject, BehaviorSubject } from 'rxjs';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';
import { CarModel } from '../models/car.model';
import { CarTypeEnum } from '../enums/car-type.enum';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
import { LocationModel } from '../models/location.model';
import { LocationService } from './location.service';
import { NotificationService } from './notification.service';
// import * as TruffleContract from 'truffle-contract';
declare let require: any;
declare let window: any;

const tokenAbi = require('../../../assets/ABI.json');

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private web3: Web3;
  private contract: any;
  private contractAddress: string = '0x6901978eed012b5b97578fcc631a3157f6249d86';
  private currentAddress: string;
  private currentName: string;
  private spinnerRef: MatDialogRef<SpinnerComponent>;

  private addCarSubject: Subject<number>;
  private updateCarSubject: Subject<number>;
  private registerSubject: Subject<boolean>;
  private crashEventSubject: Subject<number>;
  private timeExpiredSubject: Subject<number>;
  private depositForfeitedSubject: Subject<string>;

  private eventHistoryMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private locationService: LocationService,
    private notificationService: NotificationService
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
    this.registerSubject = new BehaviorSubject<boolean>(false);
    this.crashEventSubject = new Subject<number>();
    this.timeExpiredSubject = new Subject<number>();
    this.depositForfeitedSubject = new Subject<string>();

    this.contract = new this.web3.eth.Contract(tokenAbi, this.contractAddress);

    this.contract.events.NewCar((error, result) => {
        if (!this.eventHistoryMap.get(result.id)) {
            this.eventHistoryMap.set(result.id, true);
            this.addCarSubject.next(parseInt(result.returnValues.carId, 10));
            this.notificationService.pushNotification('add', result.returnValues.owner, null, result.returnValues.carId, result.id);
        }
    });

    this.contract.events.RentCar((error, result) => {
        if (!this.eventHistoryMap.get(result.id)) {
            this.eventHistoryMap.set(result.id, true);
            this.updateCarSubject.next(parseInt(result.returnValues.carId, 10));
            this.notificationService.pushNotification('rent', result.returnValues.renter, result.returnValues.owner, null, result.id);
        }
    });

    this.contract.events.ReturnCar((error, result) => {
        if (!this.eventHistoryMap.get(result.id)) {
            this.eventHistoryMap.set(result.id, true);
            this.updateCarSubject.next(parseInt(result.returnValues.carId, 10));
            this.notificationService.pushNotification('return', result.returnValues.renter, result.returnValues.owner, null, result.id);
        }
    });

    this.contract.events.CarMove((error, result) => {
        if (!this.eventHistoryMap.get(result.id)) {
            this.eventHistoryMap.set(result.id, true);
            this.updateCarSubject.next(parseInt(result.returnValues.carId, 10));
        }
    });

    this.contract.events.CarCrash((error, result) => {
        if (!this.eventHistoryMap.get(result.id)) {
            this.eventHistoryMap.set(result.id, true);
            this.updateCarSubject.next(parseInt(result.returnValues.carId, 10));
            this.crashEventSubject.next(parseInt(result.returnValues.carId, 10));
            this.notificationService.pushNotification('crash', result.returnValues.owner, null, result.returnValues.carId, result.id);
        }
    });

    this.contract.events.RentTimeExpired((error, result) => {
        if (!this.eventHistoryMap.get(result.id)) {
            this.eventHistoryMap.set(result.id, true);
            this.timeExpiredSubject.next(parseInt(result.returnValues.carId, 10));
        }
    });

    this.contract.events.DepositForfeited((error, result) => {
        if (!this.eventHistoryMap.get(result.id)) {
          this.eventHistoryMap.set(result.id, true);
          this.depositForfeitedSubject.next(result.returnValues.renter);
        }
      });

    this.contract.events.log((error, result) => {
        console.log(result);
    });
}

// #################### Observables ###################

    onAddCar(): Observable<number> {
        return this.addCarSubject.asObservable();
    }

    onUpdateCar(): Observable<number> {
        return this.updateCarSubject.asObservable();
    }

    onRegisterEvent(): Observable<boolean> {
        return this.registerSubject.asObservable();
    }

    onCrashEvent(): Observable<number> {
        return this.crashEventSubject.asObservable();
    }

    onTimeExpired(): Observable<number> {
        return this.timeExpiredSubject.asObservable();
    }

    onDepositForfeited(): Observable<string> {
        return this.depositForfeitedSubject.asObservable();
    }

// ###################### GETTER ######################

    getContract() {
        return this.contract;
    }

    getcurrentAddress(): Observable<string> {
        if (this.currentAddress) {
            return of(this.currentAddress);
        } else {
            return this.updateCurrentAddress();
        }
    }

    getCurrentName(): Observable<string> {
        if (this.currentName) {
            return of(this.currentName);
        } else {
            return this.updateCurrentName();
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

    updateCurrentAddress(): Observable<string> {
        return from(this.web3.eth.getAccounts()).pipe(
            map((accounts) => {
                this.currentAddress = accounts[0];
                return accounts[0];
            })
        );
    }

    updateCurrentName(): Observable<string> {
        return this.updateCurrentAddress().pipe(
            mergeMap((address) => {
                return from(this.contract.methods.getNameByAddress(address).call());
            }),
            tap(name => this.currentName = name),
            tap(name => this.registerSubject.next(name ? true : false))
        );
    }

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

    deposit(value: number): Observable<string> {
        return this.getcurrentAddress().pipe(
            tap((address) => {this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.web3.eth.sendTransaction({
                    from: address,
                    to: this.contractAddress,
                    value: this.web3.utils.toWei(value.toString(), 'ether')}));
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



    rentCarByIdx(idx: number, rentTime: number, totalPrice: number): Observable<string> {
        return this.getcurrentAddress().pipe(
            tap((address) => {this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.contract.methods.rentCar(idx, rentTime).send({
                    from: address,
                    to: this.contractAddress,
                    value: this.web3.utils.toWei(totalPrice.toString(), 'ether')}));
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
                return from(this.contract.methods.addCar(
                    car.name,
                    CarTypeEnum[car.type],
                    car.age,
                    car.price,
                    Math.floor(Math.random() * 15000), // xLocate
                    Math.floor(Math.random() * 15000) // yLocate
                ).send({from: address}));
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
                return from(this.contract.methods.changeLocation(id, xLocate, yLocate, Math.random() < 0.5).send({from: address}));
            }),
            tap(() => this.spinnerRef.close()),
            catchError((err) => {
                console.log(err);
                this.spinnerRef.close();
                return of(null);
            })
        );
    }

    createCrash(id: number, damage: number): Observable<string> {
        return this.getcurrentAddress().pipe(
            tap((address) => { this.presentSpinner(); console.log(address); }),
            mergeMap((address) => {
                return from(this.contract.methods.createCrash(id).send({from: address}));
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
