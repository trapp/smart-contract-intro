let fs = require('fs');
let ConferencePay = require(__dirname + '/build/contracts/ConferencePay.json');
let config = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString('utf8'));

module.exports = async function(callback) {
    try {

        let sender = config.owner.address;
        let contractAddress = config.contract_address;
        let Contract = web3.eth.contract(ConferencePay.abi).at(contractAddress);

        let active = await Contract.active.call();
        console.log('active', active);

    } catch (e) {
        console.trace(e.stack);
    }
    callback();
}

async function request (method, params) {
  return new Promise((resolve, reject) => {
    web3._requestManager.sendAsync({method, params}, (err, response) => {
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
}
