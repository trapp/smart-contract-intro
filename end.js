let fs = require('fs');
let config = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString('utf8'));
let Tx = require('ethereumjs-tx');
let ConferencePay = require(__dirname + '/build/contracts/ConferencePay.json');

module.exports = async function(callback) {
    try {

        let sender = config.owner.address;
        let priv = new Buffer(config.owner.priv, 'hex');
        while (priv.length < 32) {
            priv = Buffer.concat([new Buffer([0]), priv]);
        }
        let contractAddress = config.contract_address;
        let Contract = web3.eth.contract(ConferencePay.abi).at(contractAddress);

        let options = {
            data: Contract.end.getData(),
            gasPrice: web3.toHex(await request('eth_gasPrice')),
            gasLimit: web3.toHex(500000),
            from: sender,
            to: contractAddress,
            nonce: web3.toHex(await request('eth_getTransactionCount', [sender, 'latest']))
        };

        console.log(options);
        console.log(`raw transaction: ${JSON.stringify(options)}`);

        const txToSign = new Tx(options);
        txToSign.sign(priv);

        console.log('needed', web3.fromWei(txToSign.getUpfrontCost(), 'ether').toString());

        let signer = `0x${txToSign.getSenderAddress().toString('hex')}`;
        const hash = '0x' + txToSign.hash().toString('hex');
        const serializedTx = `0x${txToSign.serialize().toString('hex')}`;
        await request('eth_sendRawTransaction', [serializedTx]);
        console.log(`sent tx ${hash}`);
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
