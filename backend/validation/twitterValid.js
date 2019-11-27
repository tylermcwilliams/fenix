const {
  twitter_keys,
  token_twitter_account,
  token_twitter_status
} = require("../config/keys");

const Dapp = require("../dapp");
const Twitter = require("twitter");

const twitterApi = new Twitter(twitter_keys);
// validates a tweet, returns the twitter user id if valid

async function verifyTwitter(tweetLink) {
  // split up the url
  const path = tweetLink.split("/");
  // return if it's not long enough
  if (path.length < 6) {
    throw "Invalid status url.";
  }

  // collect status id from url
  const statusId = path.pop().split("?")[0];

  // check status first
  const twitterStatus = await twitterApi
    .get("statuses/show/" + statusId, {
      tweet_mode: "extended"
    })
    .catch(err => {
      console.log(err);
      throw "Something went wrong when getting your tweet. Please try again later.";
    });

  if (!twitterStatus) {
    throw "Your twitter reply or retweet appears to be invalid. Please review the instructions in #announcement and try again.";
  }
  const twitterUser = twitterStatus.user;

  // check if it is EROS account
  if (twitterUser.id == token_twitter_account) {
    throw "It seems like you entered the main tweet. Please remember to add a comment when retweeting.";
  }

  // check if it's the right status
  if (
    twitterStatus.in_reply_to_status_id_str != token_twitter_status &&
    twitterStatus.quoted_status_id_str != token_twitter_status
  ) {
    console.log(twitterStatus.in_reply_to_status_id_str);
    console.log(twitterStatus.quoted_status_id_str);
    console.log(token_twitter_status);
    throw "You did not retweet or reply to the correct status.";
  }

  // check if it is older than 30 days
  if (Date.now() - new Date(twitterUser.created_at) < 2592000000) {
    throw "Your Twitter account must be 30 days or older.";
  }

  // check if it has 5 followers
  if (twitterUser.followers_count < 5) {
    throw "You need at least 5 followers on Twitter to be eligible.";
  }

  // if we're here, everything was verified successfully
  return twitterUser.id_str;
}

module.exports = verifyTwitter;
