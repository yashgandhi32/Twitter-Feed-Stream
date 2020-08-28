# Twitter Stream API

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Requirements

check Node and Npm are installed by typing follwing command in terminal

- Node 8.1.2 or higher to check version type `node -v` in terminal

### Usage

1. Fork the repo and then clone it or download it.
   ```javascript
    git clone https://github.com/yashgandhi-32/Backend-API-Task.git
   ```
2. Migrate into web directory
   ```javascript
    cd Backend-API-Task
   ```
3. First install all dependencies
   ```javascript
   npm install
   ```
4. Start MongoDB client
   ```bash
   mongod(For windows)
   ```
5. Start the server
   ```javascript
   npm run start
   ```
6. Now run the app

   ```javacript
   http://localhost:3000
   ```

### There are three APIs :-

### 1. Get tweets from twitter stream

`GET /api/tweetstream?<parameters>`

This API will fetch tweets out of a stream for given keyword and save it in database

### Parameters :

| paramter  | description                                                                                    | isrequired |
| :-------- | :--------------------------------------------------------------------------------------------- | :--------- |
| `keyword` | It will keep track of data in twitter stream with provided keyword                             | true       |
| `time`    | It will Keep track of stream for a given time, time should be in milliseconds, default is 10sec | optional  |
    
   **Example:-**

    `/api/tweetstream?keyword=news`
    `/api/tweetstream?keyword=news&time=20000`

### 2. Get filtered results with given parameters

`POST /api/filtertweets`

This API will return filtered tweets saved in database on basis of provided parameters.There are various parameters provided in the table which can be used like username starts or ends with some character, date,retweet count etc.Response will be paginated.

### Parameters:

| paramter                | description                                                                                                           | isrequired |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------- | :--------- |
| `keyword`               | Needed to filter tweets based on given track                                                                          | optional   |
| `text`                  | Search tweets with given text.                                                                                        | optional   |
| `text_type`             | **Must** if **text** is given , values can be **(start, end, contain, exact)**.                                       | optional   |
| `user_name`             | Search tweets with given username                                                                                     | optional   |
| `user_name_type`        | **Must** if **user_name** is given , values can be **(start, end, contain, exact)**                                   | optional   |
| `screen_name`           | Search tweets with given screename                                                                                    | optional   |
| `screen_name_type`      | **Must** if **screen_name** is given , values can be **(start, end, contain, exact)**                                 | optional   |
| `user_mentions`         | Search tweets with mentioned users (screen_name) in it                                                                | optional   |
| `user_mentions_type`    | **Must** if **user_mentions** is given , values can be **(start, end, contain, exact)**                               | optional   |
| `retweet_count`         | Search tweets with mentioned count                                                                                    | optional   |
| `retweet_count_type`    | **Must** if **retweet_count** is given , values can be **(greater, lesser, exact)**                                   | optional   |
| `favourites_count`      | Search tweets with favourites count                                                                                   | optional   |
| `favourites_count_type` | **Must** if favourites_count is given , values can be **(greater, lesser, exact)**                                    | optional   |
| `followers_count`       | Search tweets with followers count                                                                                    | optional   |
| `followers_count_type`  | **Must** if followers_count is given , values can be **(greater, lesser, exact)**                                     | optional   |
| `start_date`            | Search tweets with date greater than start date , it should be in **timestamp**                                       | optional   |
| `end_date`              | Search tweets with date less than end date , it should be in **timestamp**                                            | optional   |
| `language`              | Search tweets with given language ex- **(en, hi)**                                                                    | optional   |
| `page_number`           | For pagination pass page number (ex - **1,2,3**). In each page default number of documents is 10                      | optional   |
| `limit`                 | This parameter will decide no of results per page .In each page default number of results is 10                       | optional   |
| `sort_by`               | sort the results with given field. values can be **(created_at , retweet_count , favourites_count , follower_count)** | optional   |
| `order_by`              | Order the results in ascending or descending.Provide **(-1)** for descending, **(1)** for ascending                   | optional   |

**Example:-**
To get the filtered result with below example , first need to run the (`tweetstream`) API with news keyword.

```javascript
{
  "keyword" : "news",
  "sort_by" : "favourites_count",
  "order_by" : -1,
  "page_number" : 1,
  "language" : "en"
}
```

### 3. Download data in a csv file

`POST /api/downloadcsv`

It is similar to this second API except it will download all the results in a csv file.All the parameters passed to (`filtertweets`) API will remain available to this API with the additional parameters described below.
**Note** there is no need to pass , ( **page_number and limit** ) parameters to this API as it will download all the records available in database

### Parameters:

| paramter      | description                                                                                                                                                                                                        | isrequired |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| `csv_columns` | Mention the names of columns needed to add in csv file. Options are **"user_name","screen_name","followers_count","retweet_count","favourites_count","text","language","created_at", "hashtags"**. Default is all. | optional   |

**Example:-**
To download the filtered result with below example , first need to run the (`tweetstream`) API with news keyword.

```javascript
{
  "keyword" : "news",
  "sort_by" : "favourites_count",
  "order_by" : -1,
  "language" : "en",
  "csv_columns":"keyword,text,retweet_count,favourites_count,created_at,user_name",
}
```
