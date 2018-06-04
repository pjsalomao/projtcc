const Router = require('express-promise-router')
const Twit = require('twit')
const db = require('../server/dbconfig')
const config  = require('../config');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()

// export our router to be mounted by the parent application
module.exports = router

// router.get('/:followers', async (req, res) => {
//   const { id } = req.params
//   const { rows } = await db.query('SELECT * FROM follower WHERE follower_id = $1', [follower_id])
//   res.send(rows[0])
//   console.log(res);
// })

// 

const T  = new Twit(config);
T.get('followers/list', {screen_name: 'nubank'}, gotData);

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
      followers[i].created_at, followers[i].protected, followers[i].following, followers[i].follow_request_sent, '00000000']
    }

    db.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
        }
      })

   // T.get('statuses/user_timeline',{screen_name: followers[i].screen_name, count: 200}, getTweet);
   console.log(followers[i].id + followers[i].screen_name);
}}