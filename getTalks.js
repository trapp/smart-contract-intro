let fs = require('fs');
let ConferencePay = require(__dirname + '/build/contracts/ConferencePay.json');
let config = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString('utf8'));

module.exports = async function(callback) {
    try {

        let sender = config.owner.address;
        let contractAddress = config.contract_address;
        let Contract = web3.eth.contract(ConferencePay.abi).at(contractAddress);

        let talks = await Contract.getTalkCount.call().toNumber();
        for (let i = 0; i < talks; i++) {
            let talk = await Contract.talks.call(i);
            console.log({
                id: i,
                balance: web3.fromWei(talk[0]).toString(),
                address: talk[1],
                title: new Buffer(talk[2].substr(2), 'hex').toString('utf-8').replace(/\u0000/g, '')
            });
        }
        console.log(`total talks: ${talks}`);

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
