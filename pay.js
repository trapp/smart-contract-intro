let fs = require('fs');
let config = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString('utf8'));
let Tx = require('ethereumjs-tx');
let ConferencePay = require(__dirname + '/build/contracts/ConferencePay.json');

module.exports = async function(callback) {
    try {

        let sender = config.other_sender.address;
        let priv = new Buffer(config.other_sender.priv, 'hex');
        while (priv.length < 32) {
            priv = Buffer.concat([new Buffer([0]), priv]);
        }
        let contractAddress = config.contract_address;
        let Contract = web3.eth.contract(ConferencePay.abi).at(contractAddress);

        await pay(0, web3.toWei('1'));
        await pay(1, web3.toWei('1'));
        await pay(2, web3.toWei('1'));
        await pay(3, web3.toWei('1'));
        await pay(4, web3.toWei('1'));
        await pay(5, web3.toWei('1'));
        await pay(6, web3.toWei('1'));
        await pay(7, web3.toWei('1'));
        await pay(8, web3.toWei('1'));
        await pay(9, web3.toWei('1'));
        await pay(10, web3.toWei('1'));
        await pay(11, web3.toWei('10'));
        await pay(12, web3.toWei('1'));
        await pay(13, web3.toWei('1'));

        async function pay(index, amount) {
            let options = {
                data: Contract.pay.getData(index),
                gasPrice: web3.toHex(await request('eth_gasPrice')),
                gasLimit: web3.toHex(100000),
                from: sender,
                to: contractAddress,
                value: web3.toHex(amount),
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
        }
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
