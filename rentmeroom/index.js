const request = require("request");
const parser = require('xml2json');
const serverkeys = require('../keys');
const keys = require('./keys');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
//const checkLogin = require('../middlewares/requireLogin');
//const validateclientinvoiceid = require('../middlewares/validateclientinvoiceid');
//onst validatestripeinvoice = require('../middlewares/validatestripeinvoice');
module.exports = app => {

   
    app.post('/rentmeroom/api/stripe/invoice', (req, res) => {

        stripe.charges.create({
            amount: req.body.amount,
            currency: "usd",
            description: "Payment for Invoice " + req.body.invoiceid,
            source: req.body.token.id

        }, function(err, charge) {
            if (err) {
                console.log(err);
            }
            else {
                var amount = charge.amount;
                var created = charge.created;
                var captured = charge.captured;
                var invoiceid = charge.description.substring(20, 30)
                var status = charge.status;
                var auth = keys.EGEOTECHNICAL;
                var description = charge.description


                var values = ({ invoiceid, amount, created, captured, status, description, auth })
                request.post({
                        url: keys.PAYMENT_ROUTE,
                        form: values
                    },
                    function(err, httpResponse, body) {
                        if (!err) {
                            var json = parser.toJson(body);
                            var parsedjson = JSON.parse(json);
                            console.log(parsedjson.response);
                            res.send(parsedjson.response);
                        }

                    });


            }
        })
    }) // End of Stripe Post

}