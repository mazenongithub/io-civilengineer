const serverkeys = require('../keys');
const keys = require('./keys')
const request = require("request");
const checkLogin = require('./functions/checklogin');
const validateInvoice = require('./functions/validateinvoice');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
const removeProfilePhoto = require('./functions/removeprofilephoto');
const uploadProfilePhoto = require('./functions/uploadprofilephoto');
const UTCString = require('./functions/utcstring');
const balanceavailable = require('./functions/balanceavailable');
const checkuser = require('./functions/checkuser');
const checkproject = require('./functions/checkproject');
const checkprofile = require('./functions/checkprofile');
const checkemail = require('./functions/checkemail')

module.exports = app => {
    //app.use(function(req, res, next) {
    //    res.header("Access-Control-Allow-Origin", keys.clientAPI);
    //    res.header("Access-Control-Allow-Credentials", "true")
    //    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //    next();
    //});


    app.post('/construction/:providerid/uploadprofilephoto', checkLogin, removeProfilePhoto, uploadProfilePhoto, (req, res) => {
        const values = { myuser: req.body.myuser }
        request.post({
                url: `https://civilengineer.io/projectmanagement/api/userendpoint.php`,
                form: values,
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
                    res.status(404).send(`Cound not make request to add existing company, please try again later`)
                }


            })



    })

    app.get('/projectmanagement/:providerid/logout', checkLogin, (req, res) => {
        req.session.destroy();
        res.send({ "message": 'Logout Successful' })

    })

    app.get('/projectmanagement/loadcsi', checkLogin, (req, res) => {

        request({
                url: `https://civilengineer.io/projectmanagement/api/loadcsi.php`,
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    const response = JSON.parse(body)
                    if (response.hasOwnProperty("csis")) {

                        res.send(response)

                    }

                    else {
                        res.status(404).send({ message: `Could not retrieve csis` })
                    }

                }

                else {
                    res.status(404).send('Error making request')
                }


                //values returned from DB


            }) // end request


    })





    app.get('/projectmanagement/checkuser', checkLogin, (req, res) => {
        const providerid = req.session.user.pm

        request({
                url: `https://civilengineer.io/projectmanagement/api/loadresponsenode.php?providerid=${providerid}`,
                headers: {
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

    app.post('/projectmanagement/:providerid/saveallprofile', checkLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/userendpoint.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    const response = JSON.parse(body)

                    if (response.hasOwnProperty("myuser")) {
                        let user = { pm: response.myuser.providerid }
                        req.session.user = user;
                        res.send(response)

                    }

                    else {
                        res.status(404).send({ message: `Error Making Request ` })
                    }

                }

                catch (err) {
                    res.status(404).send({ message: `Error Making Request ${err}` })
                }


                //values returned from DB


            }) // end request

    })

    app.post('/projectmanagement/clientlogin', (req, res) => {
        const { clientid, client, emailaddress, pass, profile, firstname, lastname, phonenumber, profileurl } = req.body;
        const values = { clientid, client, emailaddress, pass, profile, firstname, lastname, phonenumber, profileurl };



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
                        let message = "";
                        if (response.hasOwnProperty("message")) {
                            message = response.message;
                            res.status(404).send({ message: `Login was not successful ${message}` })
                        }

                    }

                }

                else {
                    res.status(404).send({ message: 'Login was not successful ', err })
                }


                //values returned from DB


            }) // end request

    })

    app.post('/projectmanagement/settleinvoice', checkLogin, validateInvoice, balanceavailable, (req, res) => {


        request.post({
                url: 'https://civilengineer.io/projectmanagement/api/settleinvoice.php',
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    const invoice = JSON.parse(body);
                    if (invoice.hasOwnProperty("accounts")) {

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

                    res.send(invoice)

                }
                catch (error) {
                    res.status(404).send({ message: `Could not settle Invoice ${error} ` })
                }

            })



    })


    app.get('/projectmanagement/:profile/checkprofile', checkprofile, (req, res) => {
        const profile = req.params.profile;

        request({
                url: `https://civilengineer.io/projectmanagement/api/checkproviderid.php?profile=${profile}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {

                try {

                    const response = JSON.parse(body)
                    res.send(response)


                }
                catch (err) {
                    res.status(404).send({ message: `Error validating email` })
                }



            })

    })

    app.post('/projectmanagement/applelogin', (req, res) => {

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/applelogin.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {

                try {
                    const response = JSON.parse(body)
                    if (response.hasOwnProperty("myuser")) {
                        let user = { pm: response.myuser.providerid }
                        req.session.user = user;


                    }

                    res.send(response)


                }
                catch (error) {
                    res.status(404).send({ message: ` Invalid Login, Please Try Again Later ${error} ${err}` })
                }


            })


    })

    app.get('/projectmanagement/:emailaddress/checkemail',checkemail, (req, res) => {
        const emailaddress = req.params.emailaddress;
        request({
                url: `https://civilengineer.io/projectmanagement/api/checkemailaddress.php?emailaddress=${emailaddress}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {

                try {

                    const response = JSON.parse(body)
                    res.send(response)


                }
                catch (error) {
                    res.status(404).send({ message: `Error validating email ${error} ${err}` })
                }



            })


    })


    app.post('/projectmanagement/:providerid/charges/:projectid', checkLogin, checkuser, checkproject, (req, res) => {

        let providerid = req.params.providerid;
        let projectid = req.params.projectid;

        let source = "";

        if (req.body.token.hasOwnProperty("id")) {
            source = req.body.token.id;
        }
        else if (req.body.token.hasOwnProperty("tokenId")) {
            source = req.body.token.tokenId;
        }

        let amount = req.body.amount;

        stripe.charges.create({
            amount: Math.round(req.body.amount * 100),
            currency: "usd",
            description: "Payment for ProjectID " + projectid,
            source,
            transfer_group: projectid

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

                    projectid = charge.transfer_group;
                    const amount = charge.amount;
                    const chargeid = charge.id;
                    let created = charge.created
                    created = new Date(created * 1000)
                    created = UTCString(created)
                    const values = { providerid, projectid, amount, chargeid, created }

                    request.post({
                            url: 'https://civilengineer.io/projectmanagement/api/chargecaptured.php',
                            form: values,
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
                                res.status(404).send({ message: `Charge was valid, error occurred updating invoic charge` });
                            }

                        });

                }
                else {
                    res.status(404).send({ message: `Could not validate charge or the charge was invalid` });


                }


            }
            else {

                res.status(404).send({ message: `Charge failed ${err}` })
            }

        })


    })





}
