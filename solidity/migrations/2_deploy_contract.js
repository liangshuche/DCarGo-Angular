// var Hello = artifacts.require("./Hello.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Hello);
// };
//var ownable = artifacts.require('./ownable.sol')
var CarRenter = artifacts.require('./CarRenter.sol')
// var erc721 = artifacts.require('./erc721.sol')
// var safemath = artifacts.require('./safemath.sol')
//var ozombieownership = artifacts.require('./zombieownership.sol')
var CarHelper = artifacts.require('./CarHelper.sol')

module.exports = function (deployer) {
  // deployer.deploy(ownable)
  // deployer.deploy(safemath)
  //deployer.deploy(CarRenter)
  deployer.deploy(CarHelper)

  // deployer.link(zombiefactory, ownable)
  // deployer.link(zombiefactory,safemath)
  // deployer.link(zombiefactory, erc721)
  // deployer.deploy(zombiefactory)
  // deployer.link(zombiefactory,zombiehelper)
  // deployer.deploy(zombiehelper)
}