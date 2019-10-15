const keys = require('../keys');
const serverkeys = require('../../keys');
const request = require("request");
const parser = require('xml2json');
const stripe = require("stripe")(keys.stripesecretkey);
const getstripefrominvoice = require('../functions/getstripefrominvoice');
const updateAllProjects = require('../functions/updateallprojects')
const checkLogin = require('../functions/checkLogin');

module.exports = app => {

    app.post('/projectmanagement/:providerid/projects/:projectid/createcharge/:invoiceid', getstripefrominvoice, (req, res) => {
        const number = req.body.number;
        const exp_month = req.body.exp_month;
        const exp_year = req.body.exp_year;
        const cvc = req.body.cvc;

        stripe.tokens.create({
            card: {
                number,
                exp_month,
                exp_year,
                cvc,
            }
        }, function(err, token) {
            // asynchronously called

            if (!err) {
                let providerid = req.params.providerid;
                let invoiceid = req.params.invoiceid;
                let projectid = req.params.projectid;
                let stripe_id = req.body.stripe;
                let commission = req.body.commission;
                let source = token.id
                let amount = req.body.amount;
                let application_fee = Math.round((amount * (.058)) + 60)
                console.log(providerid, invoiceid, projectid, stripe_id, commission, source, amount)

                stripe.charges.create({
                        amount,
                        currency: "usd",
                        description: "Payment Made for Invoice ID " + invoiceid,
                        source,
                        statement_descriptor: 'app.gohireme.com',
                        destination: {
                            amount: (amount - application_fee),
                            account: stripe_id
                        },
                        transfer_group: invoiceid
                    },
                    function(err, charge) {
                        if (charge) {

                            let charge_id = charge.id;
                            let amount = charge.amount;
                            let created = charge.created;
                            let captured = charge.captured;
                            let status = charge.status;
                            let description = charge.description
                            if (commission) {
                                let award_commission = Math.round(amount * .02);
                                stripe.transfers.create({
                                    amount: award_commission,
                                    currency: "usd",
                                    destination: commission,
                                    transfer_group: invoiceid,
                                }).then(function(transfer) {
                                    //insert transfer id

                                });

                            }
                            let values = { amount, invoiceid, projectid, providerid, description }

                            request.post({
                                    url: `${keys.secretapi}/invoicepayment.php`,
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
                                        response = updateAllProjects(response)
                                        res.send(response);
                                    }
                                    else {


                                        err = JSON.parse(err)
                                        res.send({ errorMessage: "There was a server error making the request" });
                                    }

                                }) // end request

                        }
                        else {

                            res.send({ errorMessage: " Error response from stripe could not capture charge transaction " })
                        }


                    })




            }
            else {
                console.log(err)
                res.send({ errorMessage: err.raw.message })
            }


        });

    })



    app.post('/projectmanagement/:providerid/projects/:projectid/invoicepayment/:invoiceid', getstripefrominvoice, (req, res) => {
        let providerid = req.params.providerid;
        let invoiceid = req.params.invoiceid;
        let stripe_id = req.body.stripe;
        let commission = req.body.commission;
        let source = req.body.token.id;
        let amount = req.body.amount;
        let application_fee = Math.round((amount * (.058)) + 60)
        console.log({ providerid, invoiceid, stripe_id, commission, source, amount, application_fee })
        let projectid = req.body.projectid;
        stripe.charges.create({
                amount,
                currency: "usd",
                description: "Payment Made for Invoice ID " + invoiceid,
                source,
                statement_descriptor: 'app.gohireme.com',
                destination: {
                    amount: (amount - application_fee),
                    account: stripe_id
                },
                transfer_group: invoiceid
            },
            function(err, charge) {
                if (charge) {

                    let charge_id = charge.id;
                    let amount = charge.amount;
                    let created = charge.created;
                    let captured = charge.captured;
                    let status = charge.status;
                    let description = charge.description
                    if (commission) {
                        let award_commission = Math.round(amount * .02);
                        stripe.transfers.create({
                            amount: award_commission,
                            currency: "usd",
                            destination: commission,
                            transfer_group: invoiceid,
                        }).then(function(transfer) {
                            //insert transfer id

                        });

                    }
                    let values = { amount, invoiceid, projectid, providerid, description }

                    request.post({
                            url: `${keys.secretapi}/invoicepayment.php`,
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
                                response = updateAllProjects(response)
                                res.send(response);
                            }
                            else {

                                err = JSON.parse(err)
                                res.send({ errorMessage: "There was an error making the request" });
                            }

                        }) // end request

                }
                else {

                    res.send({ errorMessage: " Error response from stripe could not capture " })
                }


            })




    })

    app.get('/projectmanagement/:providerid/stripe/:pass', (req, res) => {

        let providerid = req.params.providerid;
        let pass = req.params.pass;
        let values = { providerid, pass }

        request.post({
                url: `${keys.secretapi}/loginnative.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    console.log(response)
                    let providerid = "";
                    if (response.hasOwnProperty("valid")) {

                        req.session.user = { providerid: response.providerid }
                        let providerid = response.providerid;

                        let stripe_redirect = `${keys.rootserver}/projectmanagement/stripe/updatepaymentid`
                        stripe_redirect = encodeURIComponent(stripe_redirect);

                        //redirect_uri=http://webdevbootcamp-mazenoncloud9.c9users.io:8081/api/stripe/updatepaymentid&response_type=code&client_id=ca_ETdAZ69zcymVDO45aRGOnspAT9xHuv43&scope=read_write
                        const stripe = `https://connect.stripe.com/oauth/authorize?response_type=code&redirect_uri=${stripe_redirect}&client_id=${keys.stripeconnect}&state=${providerid}&stripe_user[business_type]=company&scope=read_write`

                        res.redirect(stripe)


                    }
                    else {
                        res.redirect(`${keys.rootclient}/providers/login/Invalid login please try again`)
                        //redirect failed login



                    }

                    //values returned from DB

                }

            }) // end request





    })



    app.get('/projectmanagement/stripe/updatepaymentid', checkLogin, (req, res) => {
        const grant_type = 'authorization_code';
        const code = req.query.code;
        const client_secret = keys.stripesecretkey;
        const values = { grant_type, code, client_secret }
        //let providerid = req.session.user.providerid;
        let providerid = req.query.state;

        request.post({
                url: 'https://connect.stripe.com/oauth/token',
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                }

            },
            function(err, httpResponse, body) {
                if (!err) {
                    let parsedjson = JSON.parse(body);
                    let values = { stripe: parsedjson.stripe_user_id, providerid }

                    request.post({
                            url: `${keys.secretapi}/updatestripeprofile.php`,
                            form: values,
                            headers: {
                                'Content-Type': 'application/json',
                                'Permission': `${keys.grantAuthorization}`
                            }
                        },
                        function(err, httpResponse, body) {
                            if (!err) {
                                let json = parser.toJson(body);
                                let parsedjson = JSON.parse(json)
                                let response = parsedjson.response;
                                providerid = response.providerid;
                                res.redirect(`${keys.rootclient}/${providerid}/profile`)


                            }

                        })


                }


            }) // end request

    })

    app.get('/projectmanagement/stripe/getuserloginlink', (req, res) => {
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                if (req.session.user.hasOwnProperty("stripe")) {
                    if (req.session.user.stripe) {
                        stripe.accounts.createLoginLink(
                            req.session.user.stripe,
                            function(err, link) {
                                // asynchronously called
                                if (!err) {
                                    res.send(link)
                                }
                                else {
                                    res.send({ errorMessage: "There was an error retrieving login link" })
                                }
                            }
                        );
                    }

                }


            }
        }

    })

}
