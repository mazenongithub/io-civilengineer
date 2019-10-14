const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');
const stripe = require("stripe")(keys.stripesecretkey);
const requireLogin = require('../middlewares/requireLogin');
const validateclientinvoiceid = require('../middlewares/validateclientinvoiceid');
const validatestripeinvoice = require('../middlewares/validatestripeinvoice');
module.exports = app => {
    app.get('/invoice/:invoiceid/show', validateclientinvoiceid, (req, res) => {
        var invoiceid = req.params.invoiceid;
        var auth = keys.EGEOTECHNICAL;
        var params = "invoiceid=" + invoiceid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/findinvoicebyid.php?" + params;

        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    res.send(parsedjson.response)
                }
            }

        })

    })

    app.get('/invoice/:clientid/getall', requireLogin, (req, res) => {
        var clientid = req.params.clientid;
        var auth = keys.EGEOTECHNICAL;
        var params = "clientid=" + clientid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/showallinvoice.php?" + params;

        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    res.send(parsedjson.response)
                }
            }

        })

    })

    app.post('/api/stripe/invoice', validatestripeinvoice, (req, res) => {

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
