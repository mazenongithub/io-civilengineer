const serverkeys = require('../keys');
const keys = require('./keys')
const request = require("request");
const checkLogin = require('./functions/checklogin');
const validateInvoice = require('./functions/validateinvoice');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);

module.exports = app => {
    //app.use(function(req, res, next) {
    //    res.header("Access-Control-Allow-Origin", keys.clientAPI);
    //    res.header("Access-Control-Allow-Credentials", "true")
    //    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //    next();
    //});

    app.get('/projectmanagement/:providerid/logout', checkLogin, (req, res) => {
        req.session.destroy();
        res.send({ "response": 'Logout Successful' })

    })


    app.get('/projectmanagement/:providerid/checkuser', checkLogin, (req, res) => {
        const providerid = req.params.providerid;

        request({
                url: `https://civilengineer.io/projectmanagement/api/loadresponsenode.php?providerid=${providerid}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const response = JSON.parse(body)
                    if (response.hasOwnProperty("myuser")) {
                        let user = { pm: response.myuser.providerid }
                        req.session.user = user;
                        res.send(response)

                    }

                    else {
                        res.status(404).send('Invalid Login')
                    }

                }

                else {
                    res.status(404).send('Error making request')
                }


                //values returned from DB


            }) // end request


    })

    app.post('/projectmanagement/clientlogin', (req, res) => {
        const { clientid, client, emailaddress } = req.body;
        const values = { clientid, client, emailaddress };

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/loginclientnode.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const response = JSON.parse(body)

                    if (response.hasOwnProperty("myuser")) {
                        let user = { pm: response.myuser.providerid }
                        req.session.user = user;
                        res.send(response)

                    }

                    else {
                        res.status(404).send('Invalid Login')
                    }

                }

                else {
                    res.status(404).send('Error making request')
                }


                //values returned from DB


            }) // end request

    })


    app.post('/projectmanagement/:providerid/invoicepayment/:invoiceid', checkLogin, validateInvoice, (req, res) => {

        let providerid = req.params.providerid;
        let invoiceid = req.params.invoiceid;
        let source = "";

        if (req.body.token.hasOwnProperty("id")) {
            source = req.body.token.id;
        }
        else if (req.body.token.hasOwnProperty("tokenId")) {
            source = req.body.token.tokenId;
        }

        let amount = req.body.amount;

        stripe.charges.create({
            amount: req.body.amount,
            currency: "usd",
            description: "Payment for Invoice " + invoiceid,
            source

        }, function(err, charge) {
            if (charge) {

                const validatecharge = () => {
                    let validate = false;
                    if (charge.captured && charge.status === 'succeeded') {
                        validate = true;
                    }
                    return validate;
                }

                if (validatecharge()) {

                    request.post({
                            url: 'https://civilengineer.io/projectmanagement/api/invoicecaptured.php',
                            form: { invoiceid },
                            headers: {
                                'Content-Type': 'application/json',
                                'Permission': `${keys.grantAuthorization}`
                            }
                        },
                        function(err, httpResponse, body) {
                            if (!err) {
                                const response = JSON.parse(body)
                                res.send(response)
                            }
                            else {
                                console.log(err, `Could not update charge`)
                            }

                        });

                }
                else {
                    res.status(404).send(`Charge capture failed`);


                }


            }
            else {
                res.status(404).send(`Could not capture charge `)
            }

        })


    })





}
