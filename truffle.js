module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // Configured to use with Ganache
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};
