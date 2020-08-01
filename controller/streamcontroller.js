const Tweet = require("../models/Tweet");
const Twit = require("twit");
const config = require("../configs/config");


var T = new Twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

//this function will keep track on twitter stream for a given keyword and fetch data from it

exports.streamTweets = (req, res) => {

  if (!req.query.keyword) {
    res.status(400).json({error:true,msg:'Pls add a keyowrd to keep track'});
    return
  }

  var stream = T.stream("statuses/filter", {
    track: req.query.keyword || "modi"
  });

  stream.on("tweet", function(tweet) {
    var tweet = new Tweet({
      keyword: req.query.keyword,
      timestamp_ms: new Date(tweet.created_at).getTime(),
      text: tweet.text,
      user_name: tweet.user.name,
      retweet_count: tweet.retweet_count,
      favourites_count: tweet.user.favourites_count,
      id: tweet.user.id,
      followers_count: tweet.user.followers_count,
      user_mentions: tweet.entities.user_mentions,
      created_at: tweet.created_at,
      screen_name: tweet.user.screen_name,
      language: tweet.lang,
      urls: tweet.entities.urls,
      hashtags: tweet.entities.hashtags.map(val => val.text)
    });

    tweet.save(function(err, result) {
      if (err) console.log(err);
    });
  });

  setTimeout(function() {
    stream.stop();
    res.send("Tweets fetched");
  }, parseInt(req.query.time) || 10000);
};
