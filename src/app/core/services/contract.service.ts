import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
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

  constructor() {
    if (typeof window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      console.log(this.web3);
    } else {
      // this.web3Provider = new Web3.providers.HttpProvider('')
      console.log('error');
    }

    this.contract = new this.web3.eth.Contract(tokenAbi, this.contractAddress);
  }

  getAccount() {
    this.web3.eth.getAccounts().then((account) => {
      console.log(account);
    });
  }
}
