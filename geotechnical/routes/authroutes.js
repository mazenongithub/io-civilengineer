const keys = require('../keys');
const request = require("request");
const parser = require('xml2json');
const updateUserResponse = require('../middlewares/updateUserResponse');
const updateEngineers = require('../middlewares/updateEngineers');
const checkLogin = require('../middlewares/checkLogin');
const checkClientID = require('../middlewares/checkclientid');
const requireLogin = require('../middlewares/checkLogin');
module.exports = app => {

    app.post('/geotechnical/:clientid/createnewproject', checkLogin, (req, res) => {
        let values = req.body;
        values.clientid = req.params.clientid;
        console.log(values)

        request.post({
                url: `https://www.egeotechnical.com/eclient/api/createnewproject.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    if (parsedjson.hasOwnProperty("response")) {
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("projects")) {
                            res.send(response)
                        }
                        else {
                            res.send({ error: "Something went wrong " })
                        }
                    }


                }
                else {

                    res.send({ error: "Something went wrong " })
                }

            }) // end request
    })
    app.post('/geotechnical/:clientid/updateuserprofile', checkLogin, (req, res) => {
        let values = req.body;
        values.clientid = req.params.clientid;
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/updateuserprofile.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    if (parsedjson.hasOwnProperty("response")) {
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("clientid")) {

                            res.send(response)
                        }
                        else {
                            res.send({ error: "Something went wrong " })
                        }
                    }


                }
                else {

                    res.send({ error: "Something went wrong " })
                }

            }) // end request
    })
    app.post('/geotechnical/clientregister', checkClientID, (req, res) => {
        console.log(req.body)
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/register.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    if (parsedjson.hasOwnProperty("response")) {
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("clientid")) {

                            req.session.user = { clientid: response.clientid };
                            res.redirect(`${keys.clientAPI}/${response.clientid}/projects`)
                        }
                        else {
                            let message = encodeURIComponent("Invalid login please try again")
                            res.redirect(keys.clientAPI + "/client/login/" + message)
                        }
                    }


                }
                else {

                    let message = encodeURIComponent("Invalid login please try again")
                    res.redirect(keys.clientAPI + "/client/login/" + message)
                }

            }) // end request
    })

    app.post('/geotechnical/:clientid/updateclientregister', checkClientID, (req, res) => {
        let values = req.body;
        values.oldclientid = req.params.clientid;
        values.gender = values.gender[0]
        console.log(values)
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/updateclientregister.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    if (parsedjson.hasOwnProperty("response")) {
                        let response = parsedjson.response;
                        if (response.hasOwnProperty("clientid")) {

                            req.session.user = { clientid: response.clientid };
                            res.redirect(`${keys.clientAPI}/${response.clientid}/projects`)
                        }
                        else {
                            let message = encodeURIComponent("Invalid login please try again")
                            res.redirect(keys.clientAPI + "/client/login/" + message)
                        }
                    }


                }
                else {

                    let message = encodeURIComponent("Invalid login please try again")
                    res.redirect(keys.clientAPI + "/client/login/" + message)
                }

            }) // end request
    })


    app.get('/geotechnical/:clientid/checkclientid', (req, res) => {
        let clientid = req.params.clientid;
        let values = { clientid }
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/checkclientid.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    res.send(response)
                }
                else {
                    res.send({ message: "There was an error making the request " })
                }

            }) // end request
    })
    app.post('/geotechnical/:clientid/saveclientdata', checkLogin, (req, res) => {

        request.post({
                url: `https://www.egeotechnical.com/eclient/api/eclientendpoint.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body && !err) {

                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    let response = updateUserResponse(parsedjson.response);
                    response = updateEngineers(response)
                    res.send(response);
                }
                else {
                    res.send({ errorMessage: " There was an error making your request" });
                }
            }) // end request
    })
    app.post('/geotechnical/clientlogin', (req, res) => {

        request.post({
                url: `https://www.egeotechnical.com/eclient/api/login.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {

                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    if (parsedjson.hasOwnProperty("response")) {
                        let response = parsedjson.response;

                        if (response.hasOwnProperty("clientid")) {

                            req.session.user = { clientid: response.clientid };
                            res.redirect(`${keys.clientAPI}/${response.clientid}/projects`)
                        }
                        else {
                            let message = encodeURIComponent("Invalid login please try again")
                            res.redirect(keys.clientAPI + "/client/login/" + message)
                        }
                    }


                }
                else {

                    let message = encodeURIComponent("Invalid login please try again")
                    res.redirect(keys.clientAPI + "/client/login/" + message)
                }

            }) // end request
    })

    app.get('/geotechnical/checkclientid', (req, res) => {
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty(("user"))) {
                if (req.session.user.hasOwnProperty("clientid")) {
                    res.send(req.session.user)
                }
                else {
                    res.send({ message: 'User is not logged in' })
                }
            }
            else {
                res.send({ message: 'User is not logged in' })
            }
        }
        else {
            res.send({ message: 'User is not logged in' })
        }
    })


    app.get('/geotechnical/getengineers', (req, res) => {
        let values = { clientid: req.params.clientid };
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/getengineers.php`,
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
                    response = updateEngineers(response)
                    res.send(response);
                    //values returned from DB

                }
                else {
                    res.send({ errorMessage: "Error, please try again " })
                }

            }) // end request
    })
    app.get('/geotechnical/:clientid/getproject/:projectid', (req, res) => {
        let values = { clientid: req.params.clientid, projectid: req.params.projectid };
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/getproject.php`,
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
                    response = updateUserResponse(response);
                    res.send(response);
                    //values returned from DB

                }
                else {
                    res.send({ errorMessage: "Error, please try again " })
                }

            }) // end request
    })
    app.get('/geotechnical/:clientid/getclient', checkLogin, (req, res) => {
        let values = { clientid: req.params.clientid };
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/getclient.php`,
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
                    response = updateUserResponse(response);
                    res.send(response);
                    //values returned from DB

                }
                else {
                    res.send({ errorMessage: "Error, please try again " })
                }

            }) // end request
    })
    app.post('/geotechnical/:clientid/getmoreprojects', checkLogin, (req, res) => {

        request.post({
                url: `https://www.egeotechnical.com/eclient/api/getmoreprojects.php`,
                form: req.body,
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
                    response = updateUserResponse(response);
                    res.send(response);
                    //values returned from DB

                }
                else {
                    res.send({ errorMessage: "Error, please try again " })
                }

            }) // end request
    })
    app.get('/geotechnical/:clientid/loadclient', (req, res) => {
        let values = { clientid: req.params.clientid };
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/loadclientprofile.php`,
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
                    res.send(response);
                    //values returned from DB

                }
                else {
                    res.send({ errorMessage: "Error, please try again " })
                }

            }) // end request
    })
    app.get("/geotechnical/:clientid/clientlogout", checkLogin, (req, res) => {
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty(("user"))) {
                if (req.session.user.hasOwnProperty("clientid")) {
                    req.session.destroy();
                    res.redirect(keys.clientAPI + "/client/login")
                }
                else {
                    res.redirect(keys.clientAPI + "/client/login")
                }
            }
            else {
                res.redirect(keys.clientAPI + "/client/login")
            }
        }
        else {
            res.redirect(keys.clientAPI + "/client/login")
        }

    })
}
