// ./routes/index.js
const followers = require('./followers')
//const photos = require('./photos')

module.exports = (app) => {
  app.use('/followers', followers)
  //app.use('/photos', photos)
  // etc..
}
