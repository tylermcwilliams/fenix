const HDWalletProvider = require("truffle-hdwallet-provider");
const eutil = require("ethereumjs-util");
const web3Utils = require("web3-utils");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const app = require("express")();

//routes
const claimRoute = require("./routes/claim");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/", claimRoute);

app.listen(5000, () => {
  console.log("server up on port 5000");
});
