// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("./models/User"); // Thay bằng đường dẫn đúng đến model User của bạn
// require("dotenv").config(); // Load biến môi trường từ file .env

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK_URL, // URL callback đã đăng ký trên Google Console
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Tìm hoặc tạo người dùng
//         const existingUser = await User.findOne({ googleId: profile.id });
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = await User.create({
//           googleId: profile.id,
//           email: profile.emails[0].value,
//           name: profile.displayName,
//         });

//         done(null, newUser);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// module.exports = passport;
