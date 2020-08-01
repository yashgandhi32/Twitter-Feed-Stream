var Tweet = require("../models/Tweet");
var Json2csvParser = require("json2csv").Parser;

/**
 *  This function returns regex for string paramters like username,screename that match,
 *  ends or start with specified keywords.
 */

function getStringFilter(type, param) {
  var string_filter = {
    contain: new RegExp(param, "i"),
    exact: param,
    start: new RegExp("^" + param, "i"),
    end: new RegExp(param + "$", "i")
  };
  return string_filter[type];
}

/**
 * This function returns query for integer parameter retweetcount,
 * followercounts etc
 */

function getCountFilter(type, param) {
  var count_filter = {
    greater: { $gt: param },
    lesser: { $lt: param },
    exact: param
  };
  return count_filter[type];
}

/**
 * This function initialize query object with various parameters passed
 * with HTTP request
 */

function assignQueryparameter(query) {
  var query_object = {};

  if (parseInt(query.retweet_count) >= 0 && query.retweet_count_type) {
    query_object.retweet_count = getCountFilter(
      query.retweet_count_type,
      parseInt(query.retweet_count)
    );
  }
  if (parseInt(query.followers_count) >= 0 && query.followers_count_type) {
    query_object.followers_count = getCountFilter(
      query.followers_count_type,
      parseInt(query.followers_count)
    );
  }
  if (parseInt(query.favourites_count) >= 0 && query.favourites_count_type) {
    query_object.favourites_count = getCountFilter(
      query.favourites_count_type,
      parseInt(query.favourites_count)
    );
  }
  if (query.text && query.text_type) {
    query_object.text = getStringFilter(query.text_type, query.text);
  }
  if (query.screen_name && query.screen_name_type) {
    query_object.screen_name = getStringFilter(
      query.screen_name_type,
      query.screen_name
    );
  }
  if (query.hashtags) {
    query_object.hashtags = {
      $in: query.hashtags.split(",")
    };
  }
  if (query.user_name && query.user_name_type) {
    query_object.user_name = getStringFilter(
      query.user_name_type,
      query.user_name
    );
  }
  if (query.user_mentions && query.user_mentions_type) {
    query_object.user_mentions = {
      $elemMatch: {
        screen_name: getStringFilter(
          query.user_mentions_type,
          query.user_mentions
        )
      }
    };
  }
  if (query.keyword) {
    query_object.keyword = query.keyword;
  }
  if (query.language) {
    query_object.language = query.language;
  }
  if (query.start_date) {
    query_object.timestamp_ms = {
      $gt: parseInt(query.start_date)
    };
  }
  if (query.end_date) {
    if (query_object.timestamp_ms) {
      query_object.timestamp_ms["$lt"] = parseInt(query.end_date);
    } else {
      query_object.timestamp_ms = {
        $lt: parseInt(query.end_date)
      };
    }
  }
  return query_object;
}

/**
 * This function initialize and return object for sorting filtered result
 */

function sortObject(sort_by, order_by) {
  var sort_object = {};
  sort_object[sort_by || "_id"] = parseInt(order_by) || -1;
  return sort_object;
}

/**
 * This function returns the parsed result in csv format
 */
function downloadFilteredTweetscsv(results, csv_columns) {
  var fields =
    (csv_columns != null && typeof csv_columns === 'string')
      ? csv_columns.split(",")
      : [
          "user_name",
          "keyword",
          "screen_name",
          "followers_count",
          "retweet_count",
          "favourites_count",
          "text",
          "language",
          "created_at",
          "hashtags"
        ];

  const parser = new Json2csvParser({
    fields: fields
  });
  const csv = parser.parse(results) + "\r\n";
  return csv;
}

/**
 * This fucntion returns the final filtered result in HTTP response
 */

exports.filterTweets = (req, res) => {
  var limit = parseInt(req.body.limit) || 10;
  var page_number = (parseInt(req.body.page_number) || 1) - 1;

  var sort_object = sortObject(req.body.sort_by, req.body.order_by);
  var query_object = assignQueryparameter(req.body);

  if (req.download_csv == true) {
    Tweet.find(query_object)
      .sort(sort_object)
      .exec(function(err, results) {
        if (err) console.log(err);
        else {
          var csv = downloadFilteredTweetscsv(
            results,
            req.body.csv_columns || null
          );
          res.attachment("tweets.csv");
          res.send(csv);
          return;
        }
      });
  } else {
    Tweet.find(query_object)
      .sort(sort_object)
      .skip(limit * page_number)
      .limit(limit)
      .exec(function(err, results) {
        if (err) console.log(err);
        else {
          res.json({
            error: false,
            length: results.length,
            data: results
          });
        }
      });
  }
};
