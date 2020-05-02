const serverkeys = require('../keys');
const keys = require('./keys')
const request = require("request");
const checkUserLogin = require('./functions/checkuserlogin');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
const authenticateStripe = require('./functions/authenticatestripe')
var bodyParser = require("body-parser");

module.exports = app => {


    app.post('/construction/webhookendpoint', authenticateStripe, (req, res) => {

        const stripe = () => {
            return (req.body)
        }
        const balanceavailable = () => {

            return (req.body)
        }

        const type = stripe().type;

        if (type === 'charge.succeeded') {

            const livemode = stripe().data.object.livemode
            const charge = stripe().data.object.object;
            const succeeded = stripe().data.object.status;
            const captured = stripe().data.object.captured;
            const amount = stripe().data.object.amount;
            const description = stripe().data.object.description
            let invoiceid = description.substring(19, 35)
            invoiceid = invoiceid.trim();
            const values = { invoiceid }

            if (captured) {

                request.post({
                        url: 'https://civilengineer.io/construction/api/invoicecaptured.php',
                        form: values,
                        headers: {
                            'Content-Type': 'application/json',
                            'Permission': `${keys.grantAuthorization}`
                        }
                    },
                    function(err, httpResponse, body) {
                        if (!err) {
                            body = JSON.parse(body)
                            res.send(body);

                        }
                        else {
                            res.status(404).send(`There was an error making the request`)
                        }

                    });
            }


        }
        else if (type === 'balance.available') {

            let amount = balanceavailable().data.object.available[0].amount;
            request.post({
                    url: 'https://civilengineer.io/construction/api/settlements.php',
                    form: { amount },
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },
                function(err, httpResponse, body) {
                    if (!err) {
                        body = JSON.parse(body)
                        const invoices = body.invoices;
                        invoices.map(invoice => {
                            if (invoice.accounts) {

                                invoice.accounts.map(account => {

                                    stripe.transfers.create({
                                        amount: account.amount,
                                        currency: "usd",
                                        destination: account.stripe,
                                        transfer_group: invoice.invoiceid
                                    }).then(function(transfer) {
                                        //insert transfer id

                                    });


                                })
                            }
                        })
                        res.send(body)

                    }
                    else {
                        res.status(404).send(`There was an error making the request`)
                    }

                });



        }





    })





    app.get('/construction/checkuser', checkUserLogin, (req, res) => {

        let providerid = req.session.user.construction;

        request.get(`https://civilengineer.io/construction/api/loadmyprofilenode.php?providerid=${providerid}`, {
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {

                    let response = JSON.parse(body)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    console.log(err)
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request


    })

    app.get('/construction/logout', checkUserLogin, (req, res) => {
        req.session.destroy();
        res.send({ "response": 'Logout Successful' })

    })

    app.post('/construction/clientlogin', (req, res) => {
        const { clientid, client, emailaddress } = req.body;
        const values = { clientid, client, emailaddress };


        request.post({
                url: `https://civilengineer.io/construction/api/loginclientnode.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const response = JSON.parse(body)
                    console.log(response)
                    if (response.hasOwnProperty("myuser")) {
                        let user = { construction: response.myuser.providerid }
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

    app.get('/construction/:providerid/getuserloginlink/:stripe', checkUserLogin, (req, res) => {

        stripe.accounts.createLoginLink(
            req.params.stripe,
            function(err, link) {
                console.log(link)
                // asynchronously called
                if (!err) {
                    res.send(link)
                }
                else {
                    res.status(404).send(err);
                }
            }
        )
    })


    app.get('/construction/stripe/accounts', (req, res) => {

        const grant_type = 'authorization_code';
        const code = req.query.code;
        const client_secret = serverkeys.STRIPE_SECRET;
        const accountid = req.query.state;
        const values = { grant_type, code, client_secret, accountid }
        console.log(values)


        request.post({
                url: 'https://connect.stripe.com/oauth/token',
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                }

            },
            function(err, httpResponse, body) {
                try {
                    let parsedjson = JSON.parse(body);
                    let params = { stripe: parsedjson.stripe_user_id, accountid, providerid: req.session.user.construction }
                    console.log(params)
                    request.post({
                            url: `https://civilengineer.io/construction/api/updateaccountid.php`,
                            form: params,
                            headers: {
                                'Content-Type': 'application/json',
                                'Permission': `${keys.grantAuthorization}`
                            }
                        },
                        function(err, httpResponse, body) {

                            const response = JSON.parse(body)
                            const profile = response.myuser.profile;
                            const companyid = response.myuser.company.companyid;
                            res.redirect(`${keys.clientAPI}/${profile}/company/${companyid}/accounts`)

                        })


                }
                catch (err) {
                    console.log(err)
                    res.status(404).send('API failure could not load response')
                }


            }) // end request


    })


}
