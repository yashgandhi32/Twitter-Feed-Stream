var mongoose = require("mongoose");

//tweet schema
var tweetSchema = new mongoose.Schema({
  text: { type: String },
  keyword: { type: String },
  screen_name: { type: String },
  created_at: { type: Date },
  user_id: { type: String },
  user_name: { type: String },
  timestamp_ms: { type: Number },
  retweet_count: { type: Number },
  urls: { type: Array },
  favourites_count: { type: Number },
  language: { type: String },
  followers_count: { type: Number },
  user_mentions: { type: Array },
  hashtags: { type: Array }
});

var tweet = mongoose.model("tweet", tweetSchema);

module.exports = tweet;
