import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
// import { Strategy as GithubStrategy } from 'passport-github2';
import User  from '@models/user.model';
import { ApiError } from '@util/apiResponse.util';
import { conf } from 'src/conf';
// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: conf.GOOGLE_CLIENT_ID!,
    clientSecret: conf.GOOGLE_CLIENT_SECRET!,
    callbackURL: conf.GOOGLE_CALLBACK_URL!,
},
async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                email: profile.emails[0].value,
                name: profile.displayName,
                providerType: 'google',
                googleId: profile.id,
            });
            // await user.save();
        }
        user.refreshToken = user.generateRefreshToken();
        await user.save();
        return done(null, user);
    } catch (error:any) {
        return done(new ApiError(500, "Internal Server Error", [error.message]));
    }
}));

// GitHub OAuth Strategy
// passport.use(new GithubStrategy({
//     clientID: conf.GITHUB_CLIENT_ID!,
//     clientSecret: conf.GITHUB_CLIENT_SECRET!,
//     callbackURL: conf.GITHUB_CALLBACK_URL!,
// },
// async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
//     try {
//         // Check if the user already exists
//         let user = await User.findOne({ githubId: profile.id });

//         if (!user) {
//             // Create a new user
//             user = new User({
//                 email: profile.emails[0].value,
//                 providerType: 'github',
//                 githubId: profile.id,
//                 // You can set other fields as necessary
//             });
//             await user.save();
//         }
        
//         // Return the user (including the access token)
//         const token = user.generateAccessToken();
//         return done(null, { user, token });
//     } catch (error:any) {
//         return done(new ApiError(500, "Internal Server Error", [error.message]));
//     }
// }));

export default passport;
