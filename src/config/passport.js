// const JwtStrategy = require('passport-jwt').Strategy;
// const { ExtractJwt } = require('passport-jwt');
// const { jwtSecret } = require('./vars');
// const Pgdb = require('./sequelize');

// // Sql line below
// const User = Pgdb.User;
// const jwtOptions = {
//   secretOrKey: jwtSecret,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
// };

// // Jwt Sequelize
// const jwt = async (payload, done) => {
//   try {
//     let query = {};
//     query.where = {};
//     if (payload.sub)
//       query.where.id = payload.sub;

//     const user = await User.find(query);
//     if (user) return done(null, user);
//     return done(null, false);
//   } catch (error) {
//     return done(error, false);
//   }
// };

// const oAuth = service => async (token, done) => {
//   try {
//     const userData = await authProviders[service](token);
//     const user = await User.oAuthLogin(userData);
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// };


// exports.jwt = new JwtStrategy(jwtOptions, jwt);
