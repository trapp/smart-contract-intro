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

        await addTalk('0x89E654EA2E39eB95eB8e1f5Ab7f2478f68Cce35b', "Grundlagen der Blockchain Techno");
        await addTalk('0x8a975D657e03fc8285E16B875fa816696e00d7bA', "Blockchain und ihre Relevanz für");
        await addTalk('0x21FEcbD1c464d93a53F9c601Db1Abdc5e56F0B59', "Mobility und Blockchain");
        await addTalk('0x574ccd37006c0cE5C8A93629a032F0bf74D3F3F4', "Medien und Blockchain");
        await addTalk('0xB6524581C96A74fceb167C6b0dd6088dbe760113', "Trading auf Kraken");
        await addTalk('0x53E0818A9315c2c65a4EAA257891d39a281C6332', "Öffentliche Verwaltung auf der B");
        await addTalk('0x97f033172718A8886D50205064F6901Ff9EfA40A', "Crypto-Banking");
        await addTalk('0xeF7AB3323F94729408e3B06Bd0e6bdF900E5Aa27', "Smart Economy");
        await addTalk('0xD4CbE96111869d43fc07ba7Af5070B32e82E1Ab8', "Erhalte deinen ersten Bitcoin");
        await addTalk('0x20793C18f0c930dd84abfD812B31E6A36F6720e3', "Crypto-Mining");
        await addTalk('0x7af1ca9066ED1c26da470Ab326BF1c7Cdf3f5f61', "Football and Blockchain");
        await addTalk('0xD49AC4f47b00c87ed8da2D0f169bAadbCd1f458a', "Entwickle deinen ersten Smart Co");
        await addTalk('0x4703b24f5358fd6606026018ea54c8Bbbdf2c89D', "ICOs als innovative Finanzierungsmethode für Startups");
        await addTalk('0xfb7aB65c5b3dCdB06f25366Dd19C5d7d836F6c18', "Value-Based Healthcare");

        async function addTalk(address, title) {
            // Create Tx
            let options = {
                data: Contract.add.getData(address, title),
                gasPrice: web3.toHex(await request('eth_gasPrice')),
                gasLimit: web3.toHex(100000),
                from: sender,
                to: contractAddress,
                //value: web3.toHex(web3.toWei('0.1')),
                nonce: web3.toHex(await request('eth_getTransactionCount', [sender, 'pending']))
            };
            console.log(options);
            console.log(`raw transaction: ${JSON.stringify(options)}`);

            // Sign Tx
            const txToSign = new Tx(options);
            txToSign.sign(priv);

            console.log('needed:', web3.fromWei(txToSign.getUpfrontCost(), 'ether').toString());

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
