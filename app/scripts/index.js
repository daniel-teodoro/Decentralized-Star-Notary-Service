// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import StarNotaryArtifact from '../../build/contracts/StarNotary.json'

// StarNotary is our usable abstraction, which we'll use through the code below.
const StarNotary = contract(StarNotaryArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const createStar = async () => {
  const instance = await StarNotary.deployed();
  const name = document.getElementById("starName").value;
  const symbol = document.getElementById("starSymbol").value;
  const id = document.getElementById("starId").value;
  await instance.createStar(name, symbol, id, {from: account});
  App.setStatus("New Star Owner is " + account + ".");
}

// Add a function lookUp to Lookup a star by ID using tokenIdToStarInfo()
const searchStar = async () => {
  const instance = await StarNotary.deployed();
  const id = document.getElementById("searchStarId").value;
  await instance.tokenIdToStarInfo(id, {from: account});
  let vRet1 = await instance.tokenIdToStarInfo.call(id);
  let vStarName = vRet1[0];
  let vStarSymbol = vRet1[1];
  let vStarOwner = vRet1[2];
  let vMsg = "";  
  if (vStarOwner == "0x0000000000000000000000000000000000000000")
  {
    vMsg = "Star not found";
  }
  else
  {
    vMsg = "Star Name: "+ vStarName +"<br>Star Symbol: "+ vStarSymbol + "<br>Star Owner: "+ vStarOwner;
  }
  App.setSearchStatus("Search Star Result<br>"+ vMsg);
}
// exchange stars
const exchangeStar = async () => {
  const instance = await StarNotary.deployed();
  const firstId = document.getElementById("exchangeFirstStarId").value;
  const secondId = document.getElementById("exchangeSecondStarId").value;


  await instance.exchangeStars(firstId, secondId, {from: account})

  let vRet1 = await instance.tokenIdToStarInfo.call(firstId);
  let vNewFirstOwner = vRet1[2];

  let vRet2 = await instance.tokenIdToStarInfo.call(secondId);
  let vNewSecondOwner = vRet2[2];

  let vMsg = "";  
  if (vNewFirstOwner == "0x0000000000000000000000000000000000000000" || vNewSecondOwner == "0x0000000000000000000000000000000000000000")
  {
    vMsg = "Exchange not executed";
  }
  else
  {
    vMsg = "First Star Onwer updated: "+ vNewFirstOwner +"<br>Second Star Owner updated: "+ vNewSecondOwner;
  }
  App.setExchangeStatus("Exchange Star Result<br>"+ vMsg);
}
// transfer stars
const transferStar = async () => {
  const instance = await StarNotary.deployed();
  const starId = document.getElementById("transferStarId").value;
  const transferAddress = document.getElementById("transferAddress").value;

  await instance.transferStar(starId, transferAddress, {from: account})

  let vRet1 = await instance.tokenIdToStarInfo.call(starId);
  let vNewOwner = vRet1[2];

  let vMsg = "";  
  if (vNewOwner == "0x0000000000000000000000000000000000000000")
  {
    vMsg = "Transfer not executed";
  }
  else
  {
    vMsg = "Transfer Star new Owner: "+ vNewOwner;
  }
  App.setTransferStatus("Transfer Star Result<br>"+ vMsg);
}
//

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    StarNotary.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  setSearchStatus: function (message) {
    const searchStatus = document.getElementById('searchStatus')
    searchStatus.innerHTML = message
  },    

  setExchangeStatus: function (message) {
    const exchangeStatus = document.getElementById('exchangeStatus')
    exchangeStatus.innerHTML = message
  }, 

  setTransferStatus: function (message) {
    const transferStatus = document.getElementById('transferStatus')
    transferStatus.innerHTML = message
  }, 

  createStar: function () {
    createStar();
  },

  searchStar: function (starId)
  {
    searchStar(starId);
  },

  exchangeStar: function (firstStarId, secondStarId)
  {
    exchangeStar(firstStarId, secondStarId);
  },
  
  transferStar: function (starId, transferAddress)
  {
    transferStar(starId, transferAddress);
  }  

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)

    // infura rinkeby
    // https://rinkeby.infura.io/v3/cd24fdb667e04f1e86637c7d65ddccd8
    //window.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/cd24fdb667e04f1e86637c7d65ddccd8'))

    // local
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
