const HDWalletProvider = require("truffle-hdwallet-provider");

// Allows us to use ES6 in our migrations and tests.
//require('babel-register')

// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider("frost bind scatter oyster satoshi original valid direct drip near usage panther", "https://rinkeby.infura.io/v3/cd24fdb667e04f1e86637c7d65ddccd8")
      },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    }    
  }
}
