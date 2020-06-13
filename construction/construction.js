const serverkeys = require('../keys');
const keys = require('./keys')
const request = require("request");
const checkUserLogin = require('./functions/checkuserlogin');
const stripe = require("stripe")(serverkeys.STRIPE_SECRET);
const authenticateStripe = require('./functions/authenticatestripe');
const removeProfilePhoto = require('./functions/removeprofilephoto');
const uploadProfilePhoto = require('./functions/uploadprofilephoto');

var bodyParser = require("body-parser");

module.exports = app => {


    app.get('/stripe/getbalance', (req, res) => {

        stripe.balance.retrieve(function(err, balance) {
            // asynchronously called
            console.log(balance)
        })

    })

    app.post('/construction/:providerid/uploadprofilephoto', checkUserLogin, removeProfilePhoto, uploadProfilePhoto, (req, res) => {
        const values = { myuser: req.body.myuser }
        request.post({
                url: `https://civilengineer.io/construction/api/userendpoint.php`,
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

    app.post('/construction/webhookendpoint', authenticateStripe, (req, res) => {

        const getstripe = () => {
            return (req.body)
        }

        const transfercreated = () => {
            return (req.body)
        }
        const createTransfer = (transferid, created, amount, destination, invoiceid) => {
            return ({ transferid, created, amount, destination, invoiceid })
        }
        const UTCString = (dateobj) => {
            const zeroPadding = (num) => {
                if (num < 10) {
                    num = `0${num}`

                }
                return num

            }
            const getOffsetTime = (timein) => {
                let datein = new Date(`${timein.replace(/-/g, '/')} UTC`)
                let offset = datein.getTimezoneOffset() / 60;

                return offset;

            }

            let month = dateobj.getMonth() + 1;
            month = zeroPadding(month)
            let day = dateobj.getDate();
            day = zeroPadding(day)
            let year = dateobj.getFullYear();
            let hours = dateobj.getHours();
            let minutes = dateobj.getMinutes();
            let seconds = dateobj.getSeconds();
            seconds = zeroPadding(seconds)
            minutes = zeroPadding(minutes)
            hours = zeroPadding(hours);
            let timein = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
            let offset = getOffsetTime(timein) * 2;
            let sym = '+';
            if (offset > 0) {
                sym = '-';
            }
            if (Math.abs(offset) < 10) {
                offset = `0${offset}`
            }

            const newDate = new Date(`${timein}${sym}${offset}:00`)
            hours = newDate.getHours();
            hours = zeroPadding(hours)
            year = newDate.getFullYear();
            day = newDate.getDate();
            day = zeroPadding(day);
            month = newDate.getMonth() + 1;
            month = zeroPadding(month);
            minutes = newDate.getMinutes();
            minutes = zeroPadding(minutes);
            seconds = newDate.getSeconds(seconds);
            seconds = zeroPadding(seconds);

            timein = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
            return timein
        }

        const type = getstripe().type;

        let amount = 0;

        switch (type) {


            case 'transfer.created':
                const getstripe = transfercreated();
                const transferid = getstripe.data.object.id
                amount = getstripe.data.object.amount;
                amount = Number(amount / 100).toFixed(2)
                let created = getstripe.created;
                created = new Date(getstripe.created * 1000)
                created = UTCString(created)
                const destination = getstripe.data.object.destination;
                const invoiceid = getstripe.data.object.transfer_group;
                const transfer = { transfer: createTransfer(transferid, created, amount, destination, invoiceid) }

                request.post({
                        url: 'https://civilengineer.io/construction/api/transfer.php',
                        form: transfer,
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
                            res.status(404).send({ message: `Error Updating Transfer ` })
                        }

                    })
                break;

            default:
                break;

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

                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request


    })

    app.get('/construction/:providerid/logout', checkUserLogin, (req, res) => {
        req.session.destroy();
        res.send({
            "message": `${req.params.providerid} has been logged out`
        })

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

                    if (response.hasOwnProperty("myuser")) {
                        let user = { construction: response.myuser.providerid }
                        req.session.user = user;
                        res.send(response)

                    }

                    else {

                        res.status(404).send({ message: response.message })
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


    app.get('/construction/stripe/accounts', checkUserLogin, (req, res) => {

        const grant_type = 'authorization_code';
        const code = req.query.code;
        const client_secret = serverkeys.STRIPE_SECRET;
        const accountid = req.query.state;
        const values = { grant_type, code, client_secret, accountid }


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
                            res.redirect(`${keys.clientAPI}/${profile}/company/${companyid}/accounts/${accountid}`)

                        })


                }
                catch (err) {

                    res.status(404).send('API failure could not load response')
                }


            }) // end request


    })

    app.post('/construction/:providerid/createcompany', checkUserLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/construction/api/createcompany.php`,
                form: req.body,
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
                    res.status(404).send(`Cound not make request to add company, please try again later`)
                }


            })

    })

    app.post('/construction/:providerid/addexistingcompany', checkUserLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/construction/api/addexistingcompany.php`,
                form: req.body,
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

    app.post('/construction/:providerid/savecompany', checkUserLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/construction/api/savecompany.php`,
                form: req.body,
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

    app.post('/construction/:providerid/saveproject', checkUserLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/construction/api/saveproject.php`,
                form: req.body,
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

    app.post('/construction/:providerid/saveprofile', checkUserLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/construction/api/userendpoint.php`,
                form: req.body,
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



}
