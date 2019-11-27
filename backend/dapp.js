const { master_key, infura_url } = require("./config/keys.js");
const promoABI = require("../contracts/fenix_promo_abi.json");

const HDWalletProvider = require("truffle-hdwallet-provider");
const eutil = require("ethereumjs-util");
const web3Utils = require("web3-utils");
const Web3 = require("web3");

const provider = new HDWalletProvider(master_key, infura_url);
const web3 = new Web3(provider);
const promoContract = new web3.eth.Contract(promoABI);

const Dapp = {
  signAirdrop: async function(token, sender, recipient, nTokens, nonce) {
    const h = web3Utils.soliditySha3(token, sender, recipient, nTokens, nonce);

    const signedData = await web3.eth.sign(h, sender);

    const rsv = eutil.fromRpcSig(signedData);
    return {
      v: rsv.v,
      r: eutil.bufferToHex(rsv.r),
      s: eutil.bufferToHex(rsv.s)
    };
  },

  checkTwitterID: async function(twitterId) {
    return promoContract.methods.twitterInUse().send();
  },

  checkEthAddress: async function(ethAddress) {
    return promoContract.methods.ethAddressInUse().send();
  }
};

module.exports = Dapp;
