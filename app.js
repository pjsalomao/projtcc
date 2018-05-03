console.log('Busca por followers');

//autenticate twitter app
const Twit = require('twit');
//import from config.js
const config  = require('./config');

const { Pool, Client } = require('pg')
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');


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

/*const query = {
  text: 'INSERT INTO users(name, email) VALUES($1, $2)',
  values: ['brianc', 'brian.m.carlson@gmail.com'],
}*/

//function call, triger
T.get('account/verify',{}, gotUser);

function gotUser(err, data, response)
{
  var user = data;

  const query = {
  name: 'insereUser',
  text: 'select insereUser($1,$2,$3,$4,$5)',
  values: [user.id, user.screen_name, user.description, user.followers_count, user.location]
  }
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
      }
    })
}

 T.get('followers/list', params, gotData);

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
    text: 'select insereFollower($1,$2,$3,$4,$5)',
    values: [followers[i].id, followers[i].screen_name, followers[i].description, followers[i].followers_count, followers[i].location]
    }
    client.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
        }
      })
    T.get('statuses/user_timeline',{screen_name: followers[i].screen_name, count: 200}, getTweet);
}}

function getTweet(err, data, response)
{
  var fs = require('fs');
  var tweets = data;

  for (var i = 0; i < tweets.length; i++)
    {
      //console.log(tweets[i].user.screen_name + " " + tweets[i].text + "\n");

      //let user_info = new User_info();
      const query = {
        name:'insereTweet',
        text: 'select InsereTweet($1, $2, $3)',
        values:[tweets[i].id, tweets[i].user.id, tweets[i].text]
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

      }
 }
