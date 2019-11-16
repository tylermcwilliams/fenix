const router = require("express").Router();
const Dapp = require("../dapp");
const verifyEth = require("../validation/ethValid");
const verifyTwitter = require("../validation/twitterValid");

router.post("/claim", async (req, res) => {
  const errors = {
    ethErrors: [],
    twitterErrors: []
  };

  // get twitter
  const twitterId = await verifyTwitter(req.body.tweet).catch(err => {
    return errors.twitterErrors.push(err);
  });
  // get ethAddress (just verify, essentially)
  const ethAddress = await verifyEth(req.body.ethAddress).catch(err => {
    return errors.ethErrors.push(err);
  });

  // if err, return
  if (!twitterId || !ethAddress) {
    return res.status(400).json(errors);
  }

  const rsv = await Dapp.signAirdrop(
    token,
    owner,
    ethAddress,
    100000,
    twitterId
  ).catch(err => {
    return res.status(400).json(err);
  });

  return res.json(rsv);
});

router.get("/test", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log("got one");
  return res.json({ msg: "Success" });
});

module.exports = router;
