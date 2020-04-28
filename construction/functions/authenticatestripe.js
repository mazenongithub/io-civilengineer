const serverkeys = require('../../keys');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
const webhooks = serverkeys.STRIPE_WEBHOOKS

module.exports = (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhooks);
        next();

    }
    catch (err) {
        // On error, log and return the error message
        console.log(`Error message: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

}
