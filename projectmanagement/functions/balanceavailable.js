const keys = require('../keys');
const request = require("request");
const serverkeys = require('../../keys');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
module.exports = (req, res, next) => {
    let accountbalance = 0;
    try {

        stripe.balance.retrieve(function(err, balance) {
            // asynchronously called

            if (balance.hasOwnProperty("available")) {
                accountbalance = balance.available[0].amount;

            }

        })

    }
    catch (err) {

        res.status(404).send({ message: `Could not retrieve account balance ${err}` })

    }

    if (Number(accountbalance) > 0) {


        request.post({
                url: `https://civilengineer.io/projectmanagement/api/validateinvoice.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {

                try {

                    const response = JSON.parse(body)
                    console.log(response);
                    next();

                }

                catch (err) {
                    res.status(404).send({ message: `Could not validate invoice ${err}` })
                }


                //values returned from DB


            }) // end request


    }
    else {
        res.status(404).send({ message: `Your account balance is 0` })
    }





}
