const ethUtils = require("ethereumjs-util");

async function verifyEth(ethAddress) {
  return (
    ethUtils.isZeroAddress(ethAddress) && ethUtils.isValidAddress(ethAddress)
  );
}

module.exports = verifyEth;
