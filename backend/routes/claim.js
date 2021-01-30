const router = require("express").Router();
const Dapp = require("../dapp");
const verifyEth = require("../validation/ethValid");
const verifyTwitter = require("../validation/twitterValid");

const { token_address, owner_address } = require("../config/keys.js");

router.post("/claim", async (req, res) => {
  const errors = {
    ethErrors: [],
    twitterErrors: []
  };

  console.log(req.body);

  // get twitter

  const twitterId = await verifyTwitter(req.body.retweet).catch(err => {
    return errors.twitterErrors.push(err);
  });

  // get ethAddress (just verify, essentially)
  console.log(req.body.ethAddress);
  const ethAddress = await verifyEth(req.body.ethAddress).catch(err => {
    return errors.ethErrors.push(err);
  });

  // if err, return
  if (errors.twitterErrors.length > 0 || errors.ethErrors.length > 0) {
    return res.status(400).json(errors);
  }

  const rsv = await Dapp.signAirdrop(
    token_address,
    owner_address,
    ethAddress,
    25000,
    twitterId
  ).catch(err => {
    return res.status(400).send(err);
  });

  return res.json({ nonce: twitterId, ...rsv });
});

module.exports = router;
