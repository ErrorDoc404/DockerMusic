require('dotenv').config();
const passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy
    , refresh = require('passport-oauth2-refresh');
const User = require('../../mongoose/database/schemas/User');
const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.serializeUser((user, cb) => {
    cb(null, user.discordId)
});

passport.deserializeUser(async (discordId, cb) => {
    try {
        const user = await User.findOne({ discordId });
        return user ? cb(null, user) : cb(null, null);
    } catch (err) {
        console.log(err);
        return cb(err, null);
    }
});

var discordStrat = new DiscordStrategy(
    {
        clientID: process.env.Discord_ClientID,
        clientSecret: process.env.Discord_ClientSecret,
        callbackURL: process.env.CALLBACK_URL,
        scope: scopes
    },
    async function (accessToken, refreshToken, profile, cb) {
        profile.refreshToken = refreshToken; // store this for later refreshes
        const { id, email, username, discriminator, avatar, guilds } = profile;
        try {

            refresh.requestNewAccessToken('discord', profile.refreshToken, function (err, accessToken, refreshToken) {
                if (err)
                    return console.log(err); // boys, we have an error here.

                profile.accessToken = accessToken; // store this new one for our new requests!
                profile.refreshToken = refreshToken;
            });

            const findUser = await User.findOneAndUpdate({ discordId: id }, {
                discordTag: `${username}#${discriminator}`,
                avatar,
                guilds,
                email,
            }, { new: true });
            if (findUser) {
                return cb(null, findUser);
            } else {
                const newUser = await User.create({
                    discordId: id,
                    discordTag: `${username}#${discriminator}`,
                    avatar,
                    guilds,
                    email,
                });
                return cb(null, newUser);
            }
        } catch (err) {
            console.log(err);
            return cb(err, null);
        }
    }
);

passport.use(discordStrat);
refresh.use(discordStrat);