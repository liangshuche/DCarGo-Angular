import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import { Observable, from, of } from 'rxjs';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';
import { CarModel } from '../models/car.model';
import { CarTypeEnum } from '../enums/car-type.enum';
import { MatDialog } from '@angular/material';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
// import * as TruffleContract from 'truffle-contract';
declare let require: any;
declare let window: any;

const tokenAbi = require('../contracts/contract-abi.json');

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private account: string = null;
  private web3: Web3;
  private contract: any;
  private contractAddress: string = '0xe43d15beaca390581a5c1f898805dd0bc30fe0a6';
  private currentAccount: string;
  constructor(
    private dialog: MatDialog
  ) {
    if (typeof window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      console.log(this.web3);
    } else {
      // this.web3Provider = new Web3.providers.HttpProvider('')
      console.log('error');
    }

    this.contract = new this.web3.eth.Contract(tokenAbi, this.contractAddress);
  }

  getCurrentAddress(): Observable<string> {
    return from(this.web3.eth.getAccounts()).pipe(
      map((result) => {
        return result[0];
      })
    );
  }

  registerUserName(name: string): Observable<boolean> {
    // TODO: register to contract
    console.log(name);
    return of(true);
  }

  getAccount() {
    this.web3.eth.getAccounts().then((account) => {
      console.log(account);
    });
  }

  getAllCars() {
  // getAllCars(): Observable<CarModel[]> {
    this.contract.methods.getLength().call().then((length) => {
      console.log(length);
      for (let i = 0; i < length; ++i) {
        this.contract.methods.cars(i).call().then((result) => {
          console.log(result);
        });
      }
    });
  }

  addCar() {
    this.web3.eth.getAccounts().then((account) => {
      this.contract.methods.addCar('name', 'info', CarTypeEnum.Sedan, 0, 0, 0, 0).send({from: account[0]});
    });
  }
  rentOutCar(car: CarModel) {
    console.log(car);
    this.getCurrentAccount().pipe(
      tap((account) => { this.presentSpinner(); console.log(account); }),
      mergeMap((account) => {
        return from(this.contract.methods.addCar(car.name, car.info, car.type, car.age, car.price, 0, 0).send({from: account}));
      }),
      tap(() => {
        this.dialog.closeAll();
      }),
      catchError((err) => {
        console.log(err);
        this.dialog.closeAll();
        return of(null);
      })
    ).subscribe();
  }

  private getCurrentAccount(): Observable<string> {
    if (this.currentAccount) {
      return of(this.currentAccount);
    } else {
      return from(this.web3.eth.getAccounts()).pipe(
        map((accounts) => {
          this.currentAccount = accounts[0];
          return accounts[0];
        })
      );
    }
  }

  private presentSpinner() {
    this.dialog.open(SpinnerComponent, {
      disableClose: true,
    });
  }

}
