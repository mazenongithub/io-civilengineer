const keys = require('./keys');
const request = require("request");
const parser = require('xml2json');
const updateUserResponse = require('./functions/updateuserresponse')
const updateAllUsers = require('./functions/updateallusers');
const checkUserLogin = require('./functions/checkuserlogin');
module.exports = app => {
    app.post('/construction/register', (req, res) => {

        request.post({
                url: `https://civilengineer.io/construction/api/register.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    console.log(response)
                    if (response.hasOwnProperty("providerid")) {
                        let user = { construction: response.providerid }
                        req.session.user = user;
                        response = updateUserResponse(response);
                        response = updateAllUsers(response)
                        res.send(response)

                    }
                    else if (response.hasOwnProperty("invalid")) {

                        const message = response.invalid
                        res.send({ message })
                    }
                    else {
                        const fail = 'Could not retrieve response from server  ';
                        res.status(499).send({ message: fail })
                    }




                }
                catch (err) {
                    err = 'Server could not log in user, please try again later ';
                    res.status(499).send({ message: err })

                }

                //values returned from DB


            }) // end request
    })

    app.post('/construction/loginlocal', (req, res) => {
        const { emailaddress, pass } = req.body;
        const values = { emailaddress, pass };
        console.log(values)
        request.post({
                url: `https://civilengineer.io/construction/api/login.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    console.log(response)
                    if (response.hasOwnProperty("providerid")) {
                        let user = { construction: response.providerid }
                        req.session.user = user;
                        response = updateUserResponse(response);
                        response = updateAllUsers(response)
                        res.send(response)

                    }
                    else if (response.hasOwnProperty("invalid")) {

                        const message = response.invalid
                        res.send({ message })
                    }
                    else {
                        const fail = 'Could not retrieve response from server  ';
                        res.status(499).send({ message: fail })
                    }




                }
                catch (err) {
                    err = 'Server could not log in user, please try again later ';
                    res.status(499).send({ message: err })

                }

                //values returned from DB


            }) // end request
    })


    app.post('/construction/loginclient', (req, res) => {
        const { clientid, client, firstname, lastname, emailaddress, phonenumber, profileurl } = req.body;
        const values = { clientid, client, firstname, lastname, emailaddress, phonenumber, profileurl };
        console.log(values)
        request.post({
                url: `https://civilengineer.io/construction/api/loginclient.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    console.log(response)
                    if (response.hasOwnProperty("providerid")) {
                        let user = { construction: response.providerid }
                        req.session.user = user;
                        response = updateUserResponse(response);
                        response = updateAllUsers(response)
                        res.send(response)

                    }
                    else if (response.hasOwnProperty("invalid")) {

                        const message = response.invalid
                        res.status(499).send({ message })
                    }
                    else {
                        const fail = 'Could not retrieve response from server  ';
                        res.status(499).send({ message: fail })
                    }




                }
                catch (err) {
                    err = 'Server could not log in user, please try again later ';
                    res.status(499).send({ message: err })

                }

                //values returned from DB


            }) // end request
    })


    app.get('/construction/:companyid/validatecompanyid', (req, res) => {

        let companyid = req.params.companyid;
        request.get(`https://civilengineer.io/construction/api/checkcompanyid.php?companyid=${companyid}`, {
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    console.log(err)
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request


    })
    app.get('/construction/checkuser', checkUserLogin, (req, res) => {

        let providerid = req.session.user.construction;

        request.get(`http://civilengineer.io/construction/api/loadmyprofile.php?providerid=${providerid}`, {
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    response = updateUserResponse(response);
                    response = updateAllUsers(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    console.log(err)
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request


    })
    app.get('/construction/logout', (req, res) => {
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                if (req.session.user.hasOwnProperty("construction")) {
                    req.session.destroy();
                    res.redirect(keys.clientAPI)
                }
                else {
                    res.redirect(keys.clientAPI)
                }
            }
            else {

            }
            res.redirect(keys.clientAPI)

        }
        else {
            res.redirect(keys.clientAPI)
        }


    })

    app.get('/construction/users/allusers', (req, res) => {

        let providerid = req.params.providerid;

        request.get(`http://civilengineer.io/construction/api/loadallusers.php`, {
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    response = updateAllUsers(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request


    })
    app.post('/construction/:providerid/company/:companyid', (req, res) => {

        let url = `https://civilengineer.io/construction/api/savecompany.php`;
        console.log(url, req.body)
        request.post({
                url,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;

                    response = updateUserResponse(response);
                    response = updateAllUsers(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    res.status(404).send({ message: 'Server is down' })
                }

            }) // end request

    })


    app.post('/construction/:providerid/project/:projectid', (req, res) => {

        let url = `https://civilengineer.io/construction/api/saveproject.php`;
        console.log(url, req.body)
        request.post({
                url,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    response = updateUserResponse(response);
                    response = updateAllUsers(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    res.status(404).send({ message: 'Server is down' })
                }

            }) // end request

    })

    app.post('/construction/users/registernewcompany', (req, res) => {
        let url = `https://civilengineer.io/construction/api/createcompany.php`;
        console.log(url, req.body)
        request.post({
                url,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;

                    response = updateUserResponse(response)
                    response = updateAllUsers(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request


    })

    app.post('/construction/users/addexistingcompany', (req, res) => {
        let url = `https://civilengineer.io/construction/api/addexistingcompany.php`;
        console.log(url, req.body)
        request.post({
                url,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;

                    response = updateUserResponse(response)
                    response = updateAllUsers(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request


    })


}
