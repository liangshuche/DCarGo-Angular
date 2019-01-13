# DCarGoAngular

A Decentralized Car Rental Service on Ethereum powered by Angular and web3js.

Tested on MacOS 10.14.2, Ubuntu 18.04 LTS

## Requirements

- Node (Tested with v10.11.0)
- NPM (Tested with v6.5.0)
```
# Ubuntu
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install nodejs

# MacOS
brew install node
```
- Ganache
```
npm i -g ganache-cli
```
- Truffle v4.1.14
```
npm i -g truffle@4.1.14
```
- @angular/cli
```
npm i -g @angular/cli
```
- MetaMask Extension (https://metamask.io/)

## Installation and Setup

1. `git clone https://github.com/liangshuche/DCarGo-Angular.git`
2. Start local blockchain server on another terminal, copy the mnemonic and account addresses.
```
ganache-cli
```
3. Connect MetaMask to localhost:8545. Import accounts (recommend 2+ accounts).

## Compile and Deploy Contract

1. `cd DCarGo-Angular/solidity`
2. Install dependencies
```
npm i
```
3. `cp secret.js.sample secret.js`
4. Set the `mnemonic` with the copied string in `secret.js`
5. Compile and migrate contract 
```
truffle migrate --reset
```
6. Copy `CarHelper` Address.

## Run Web App Server

1. `cd ..`
2. Install dependencies 
```
npm i
```
3. Paste contract address to `src/app/core/services/contract.service.ts:24`
4. Start Server
```
ng serve --aot
```
5. Open your browser on `localhost:4200`
