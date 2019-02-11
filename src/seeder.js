'use strict';
const User = require('./api/models/nosql/user.model');
const { adminUser } = require('./config/constants');


module.exports = {
  /**
   * bootstarp
   */
  seedDemoUser: async function() {
    try{
      let count = await User.count({});
      if(count == 0){
        await User.insertMany(adminUser)
      }
      return;
    } catch(err){
      console.log(err)
    }
   
  },
};
