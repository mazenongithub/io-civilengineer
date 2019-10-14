const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');
const stripe = require("stripe")(keys.STRIPE_SECRET);
const validatestripepayment = require('../middlewares/validatestripepayment');
const updateActualMaterial = require('../middlewares/updateActualMaterial');
module.exports = app => {


    app.post('/geotechnical/:projectid/stripe/:invoiceid', validatestripepayment, (req, res) => {

        let projectid = req.params.projectid;
        let invoiceid = req.params.invoiceid;
        let description = req.body.description;
        let clientid = req.session.user.clientid;
        let amount = req.body.amount;
        let token = req.body.token;
        stripe.charges.create({
            amount,
            currency: "usd",
            description,
            source: token.id

        }, function(err, charge) {
            if (err) {
                console.log(err);
            }
            else {
               
                var amount = charge.amount;

                var created = charge.created;
                var captured = charge.captured;
               
                var status = charge.status;;
                var description = charge.description

                var values = ({ projectid, invoiceid, clientid, amount, created, captured, status, description })
              

                request.post({
                        url: 'https://www.egeotechnical.com/eclient/api/clientpayment.php',
                        form: values,
                        headers: {
                            'Content-Type': 'application/json',
                            'Permission': `${keys.grantAuthorization}`
                        }
                    },
                    function(err, httpResponse, body) {
                        if (!err) {
                            var json = parser.toJson(body);
                            var parsedjson = JSON.parse(json);
                            let response = parsedjson.response;

                            response = response = updateActualMaterial(response);
                            res.send(response);

                        }

                    });


            }
        })
    }) // End of Stripe Post

}
