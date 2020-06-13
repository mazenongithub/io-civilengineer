const keys = require('../keys');
const request = require("request");
const serverkeys = require('../../keys');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
module.exports = (req, res, next) => {
    stripe.balance.retrieve(function(err, balance) {
        // asynchronously called

        const amount = req.body.amount;
        if (balance.hasOwnProperty("available")) {
            const accountbalance = balance.available[0].amount;

            if (Number(accountbalance) > Number(amount)) {
                next();
            }
            else {
                res.status(404).send({ message: ` Balance insufficient to settle invoice ` })
            }


        }
        else {
            res.status(404).send({ message: ` Account not found ` })

        }

    })




}
