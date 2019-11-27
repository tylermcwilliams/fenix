const { etherscan_key } = require("../config/keys");

const Dapp = require("../dapp");
const ethUtils = require("ethereumjs-util");
const etherscan = require("etherscan-api").init(etherscan_key);

async function verifyEth(ethAddress) {
  if (
    !ethUtils.isValidAddress(ethAddress) ||
    ethUtils.isZeroAddress(ethAddress)
  ) {
    throw "The ethereum address provided is invalid";
  }

  if (!Dapp.checkEthAddress(ethAddress)) {
    throw "The ethereum address provided already participated";
  }

  return ethAddress;
}

module.exports = verifyEth;
