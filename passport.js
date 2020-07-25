const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy


//Passport.js setup
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // User.findById(id, function(err, user) {
  done(null, user);
  // });
});

passport.use(new GoogleStrategy({
  clientID: '229399177616-3u0bgm5s2nn323g2ntjflqqgmkktsdut.apps.googleusercontent.com',
  clientSecret: 'iKdF5Jf_u8cdsA46F_KX1Hbo',
  callbackURL: "https://northrange.dev/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    // user profile info (mainly profile id) to check if the user is registered in your db. 
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    // });
  }
));


// passport.use(new GoogleStrategy({
//   clientID: '214399234969-3s3pb55rg0r46bhleosqddnc8fs57ucm.apps.googleusercontent.com',
//   clientSecret: 'iP6SceV9Rabw4jV8YugjrbBR',
//   callbackURL: "https://northrange.dev/google/callback"
// },
//   function (accessToken, refreshToken, profile, done) {
//     // user profile info (mainly profile id) to check if the user is registered in your db. 
//     // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return done(null, profile);
//     // });
//   }
// ));
