console.log('Busca por followers');

//autenticate twitter app
const Twit = require('twit');
//import from config.js
const config  = require('./config');

const { Pool, Client } = require('pg')
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

//new twitter object contains what is in config
const T = new Twit(config);
//search parameters object
const params =
{
  //max 200
  count: 200
}


//conect to db
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'projecttwitter',
  password: 'root',
  port: 5432,
});
client.connect()

//client.query('SELECT NOW()', (err, res) => {
  //console.log(err, res)
  //client.end()
//})


//check connection
//client.once('open', function(){
//  console.log('Conected to postgres');
//});


//check for db erros
//client.on('error', function(err){
  //console.log(err);
//});
//init app
const app = express();

//bring in models
//let User_info = require('./models/user_info');

//start server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
var usuario1;
var usuario2;
/*const query = {
  text: 'INSERT INTO users(name, email) VALUES($1, $2)',
  values: ['brianc', 'brian.m.carlson@gmail.com'],
}*/

//function call, triger
T.get('account/verify_credentials',{}, gotUser);

function gotUser(err, data, response)
{
  var user = data;
  usuario1 = user.id;

  const query = {
  name: 'insereUsuario',
  text: 'select insereUsuario($1,$2,$3,$4,$5,$6,$7,$8)',
  values: [user.id, user.screen_name, user.name, user.description, user.followers_count, 
    user.location, user.url, user.created_at]
  }
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
      }
    })
  //T.get('users/show', {user_id: usuario1, screen_name: user.screen_name}, getFollowerCursor);
}
const p2 ={
  //screen_name: 'nubank',
  count: 200
}

T.get('friends/list', p2, gotFriend);

function gotFriend(err, data, response)
{
  var friends = data.users;

  for (var j =0; j<friends.length; j++)
  {
    if (friends[j].screen_name == 'nubank')
    {  //console.log(friends[j].id + " -- " + friends[j].screen_name + " -- " + friends[j].screen_name)
    const query = {
    name: 'insereFriend',
    text: 'select insereFriend($1,$2,$3,$4,$5,$6,$7,$8)',
    values: [friends[j].id, friends[j].screen_name, friends[j].description,
    friends[j].followers_count, friends[j].location, friends[j].name, friends[j].url, usuario1]
    }
    client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
        }
      })
      usuario2 = friends[j].id;
      //T.get('followers/list', {user_id: usuario2, count: 200}, gotData);
      //T.get('users/show', {user_id: usuario2, screen_name: friends[j].screen_name}, getFollowerCursor);
      
      //console.log('teste ok' + usuario2);
      T.get('statuses/user_timeline',{screen_name: 'nubank', count: 200}, getTweet);
    }
    //T.get('statuses/user_timeline',{user_id: usuario2, count: 200}, getTweetInter);
  }
}


 //T.get('followers/list', params, gotData);

//get followers list
function gotData(err, data, response)
{
  //save followers list in array
  var followers = data.users;
  //var text  = 'insert into twitter_users(id, screen_name)';
//percorre lista de seguidores e para cada seguidor chama funçao getDescription
 for (var i = 0; i < followers.length; i++)
  {  //T.get('statuses/user_timeline',{screen_name: followers[i].screen_name, count: 20}, getTweet);
  //  var values = [followers[i].id, followers[i].screen_name]
    const query = {
    name: 'insereFollower',
    text: 'select insereFollower($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
    values: [followers[i].id, followers[i].screen_name, followers[i].name, followers[i].description,
      followers[i].followers_count, followers[i].location, followers[i].profile_location, followers[i].url,
      followers[i].created_at, followers[i].protected, followers[i].following, followers[i].follow_request_sent, usuario2]
    }

    client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
        }
      })

   T.get('statuses/user_timeline',{screen_name: followers[i].screen_name, count: 200}, getTweet);
   console.log(followers[i].id + followers[i].screen_name);
}}

function getTweet(err, data, response)
{
  //var fs = require('fs');
  var tweets = data;
  

  //console.log("1");
  for (var i = 0; i < tweets.length; i++)
    {
      //console.log(tweets[i].user.screen_name + " " + tweets[i].text + "\n");
      //console.log(tweets[i].id + tweets[i].user.id + tweets[i].text)
      //let user_info = new User_info();
      var last_id = tweets[i].id;
      const query = {
        name:'insereTweet',
        text: 'select insereTweet($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
        values:[tweets[i].id, tweets[i].user.id, tweets[i].text, tweets[i].created_at, 
        tweets[i].entities.user_mentions.id, tweets[i].entities.user_mentions.screen_name, 
                tweets[i].entities.urls.url, tweets[i].entities.urls.expanded_url,
                tweets[i].in_reply_to_status_id, tweets[i].in_reply_to_user_id, tweets[i].in_reply_to_screen_name,
                tweets[i].coordinates, tweets[i].place, tweets[i].contributors]
      }
      
      //user_info.screen_name =  tweets[i].user.screen_name;
      //user_info.twit = tweets[i].text;

      client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res.rows[0])
          }
        })
        //last_id = tweets[i].id;
        //sn = tweets[i].user.screen_name;
      }
      //last_id = tweets[tweets.length-1].id;

      console.log(last_id);
      T.get('statuses/user_timeline',{max_id: last_id, count: 200}, getTweet); 
        
 }

 function getTweetInter(err, data, response)
{
  //var fs = require('fs');
  var tweets = data;
  var last_id = 0;

 
  for (var i = 0; i < tweets.length; i++)
    {
     // console.log('teste ok' + data.entities.user_mentions.id);
      if (tweets[i].entities.user_mentions.id != null)
      {  
          
          const query = {
            name:'insereTweet',
            text: 'select InsereTweet($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
            values:[tweets[i].id, tweets[i].user.id, tweets[i].text, tweets[i].created_at, 
            tweets[i].entities.user_mentions.id, tweets[i].entities.user_mentions.screen_name, 
                    tweets[i].entities.urls.url, tweets[i].entities.urls.expanded_url,
                    tweets[i].in_reply_to_status_id, tweets[i].in_reply_to_user_id, tweets[i].in_reply_to_screen_name,
                    tweets[i].coordinates, tweets[i].place, tweets[i].contributors]
          }
          
          client.query(query, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              console.log(res.rows[0])
              }
            })
            last_id = tweets[i].id;
           
            T.get('users/show', {user_id: tweets[i].user.id, screen_name: tweets[i].user.screen_name}, gotFolInter);

        }
      }
          T.get('statuses/user_timeline',{max_id: last_id}, getTweet);
      
 }

 function gotFolInter(err, data, response)
{
  
  var followers = data;
  
    const query = {
    name: 'InsereFollowerInterage',
    text: 'select InsereFollowerInterage($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
    values: [followers[i].id, followers[i].screen_name, followers[i].name, followers[i].description,
      followers[i].followers_count, followers[i].location, followers[i].profile_location, followers[i].url,
      followers[i].created_at, followers[i].protected, followers[i].following, followers[i].follow_request_sent, usuario2]
    }
    client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
        }
      })
   T.get('statuses/user_timeline',{screen_name: followers.screen_name, count: 200}, getTweet);
}

function getFollowerCursor(err, data, response)
{

    var sname = data.screen_name;
    var cursor = -1;
    var api_path = "https://api.twitter.com/1.1/followers/list.json?screen_name=" + sname;
    console.log(api_path);
    const fs = require('fs');
    

    do{
        var url_with_cursor = api_path + "&cursor=" + cursor;
        
        request(url_with_cursor, { json: true }, (err, res, body) => {

            if (err) { return console.log(err); }
              console.log(body.url);
              console.log(body.explanation);
              cursor = body[ 'next_cursor' ];
        });

        /*var response = https.get(url_with_cursor, (resp) => {
            let result = '';
           
            // A chunk of data has been recieved.
            resp.on('result', (chunk) => {
              result += chunk;
            });
           
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
              console.log(JSON.parse(result).explanation);
            });
           
          }).on("error", (err) => {
            console.log("Error: " + err.message);
        });*/

        /*var response_dictionary = request(url_with_cursor,
         function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Aqui podes ver o HTML da página pedida. 
        }
        })*/

       // cursor = body[ 'next_cursor' ];
    } while (cursor != 0);

    

    //let bulk = JSON.stringify(response_dictionary);
    //fs.writeFileSync('response2.json', data);

}
