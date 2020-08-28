var express = require("express");
var router = express.Router();
const streamController = require("../controller/streamcontroller");
const filterController = require("../controller/filtercontroller");

//get data out of stream
router.get("/tweetstream", (req, res) => {
  streamController.streamTweets(req, res);
});

//returns filtered tweets
router.post("/filtertweets", (req, res) => {
  filterController.filterTweets(req, res);
});

//download filtered tweets in a csv file
router.post("/downloadcsv", (req, res) => { 
    req.download_csv = true;
    filterController.filterTweets(req,res);
});

module.exports = router;
