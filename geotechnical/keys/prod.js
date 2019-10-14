module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleprivatekey: process.env.googleprivatekey.replace(/\\n/g, '\n'),
    cookieKey: process.env.COOKIE_KEY,
    clientAPI: process.env.CLIENT_API,
    serverAPI: process.env.SERVER_API,
    yahooClientID: process.env.yahooClientID,
    yahooClientSecret: process.env.yahooClientSecret,
    STRIPE_SECRET: process.env.STRIPE_SECRET,
    grantAuthorization: process.env.grantAuthorization
};
