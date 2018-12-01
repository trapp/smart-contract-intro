var ConferencePay = artifacts.require("./ConferencePay.sol");

module.exports = function(deployer) {
  deployer.deploy(ConferencePay, 1543581226);
};
