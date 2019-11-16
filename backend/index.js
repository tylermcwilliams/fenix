const HDWalletProvider = require("truffle-hdwallet-provider");
const eutil = require("ethereumjs-util");
const web3Utils = require("web3-utils");
const Web3 = require("web3");
const app = require("express")();

//routes
const claimRoute = require("./routes/claim");

app.use("/claim", claimRoute);

app.listen(5000, () => {
  console.log("server up on port 5000");
});
