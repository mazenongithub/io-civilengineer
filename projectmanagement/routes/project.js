const keys = require('../keys/keys');
var request = require("request");
const parser = require('xml2json');
const setAllProjectArrays = require('../functions/updateproject');
const updateAllProjects = require('../functions/updateallprojects')
const updateProjectCosts = require('../functions/updateprojectcosts');
const updateProjectSchedule = require('../functions/updateprojectschedule');
const updateProjectTeam = require('../functions/updateprojectteam');
const updateSearchProviders = require('../functions/updatesearchproviders');
const validatenewprojectid = require('../functions/validatenewprojectid');
const checkLogin = require('../functions/checkLogin');
module.exports = app => {

    app.post('/projectmanagement/:providerid/projects/:projectid/insertinvoice', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretapi}/insertinvoice.php`,
                form: req.body,
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
                    res.send(err);
                }

            }) // end request


    })

    app.post('/projectmanagement/:providerid/projects/:projectid/insertproposal', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretapi}/insertproposal.php`,
                form: req.body,
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
                    res.send(err);
                }

            }) // end request

    })




    app.post('/projectmanagement/:providerid/projects/:projectid/saveallprojects', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretapi}/saveallprojects.php`,
                form: req.body,
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
                    res.send(err);
                }

            }) // end request


    })
    app.post('/projectmanagement/:providerid/goandhireme', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretapi}/saveallprovider.php`,
                form: req.body,
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
                    res.send(err);
                }

            }) // end request


    })
    app.post('/projectmanagement/:providerid/projects/:projectid/providerendpoint', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretapi}/providerendpoint.php`,
                form: req.body,
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
                    res.send(err);
                }

            }) // end request

    })
    app.post('/projectmanagement/:providerid/projects/insertmyproject', checkLogin, validatenewprojectid, (req, res) => {

        request.post({
                url: `${keys.secretapi}/insertmyproject.php`,
                form: req.body,
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
                    response = updateAllProjects(response);
                    res.send(response);
                }
                else {

                    err = JSON.parse(err)
                    res.send(err);
                }

            }) // end request


    })
    app.get('/projectmanagement/:providerid/projects/deletemyproject/:projectid', checkLogin, (req, res) => {
        let values = { projectid: req.params.projectid };
        if (req.hasOwnProperty("session")) {
            if (req.session.hasOwnProperty("user")) {
                values.providerid = req.session.user.providerid;
                values.access = req.session.user.access;
            }
        }

        request.post({
                url: `${keys.secretapi}/deletemyproject.php`,
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
                    res.send(parsedjson.response);
                }
                else {

                    err = JSON.parse(err)
                    res.send(err);
                }

            }) // end request


    })

    app.get('/projectmanagement/:providerid/projects/loadmyproject', checkLogin, (req, res) => {
        let providerid = req.params.providerid;
        let values = { providerid }


        request.post({
                url: `${keys.secretapi}/loadmyprojects.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response);
                    res.send(response);
                }
                else {

                    const errorMessage = "There was an error requesting the projects "
                    res.send({ errorMessage });
                }

            }) // end request


    })


    app.get('/projectmanagement/loadmyproviders', (req, res) => {

        let values = {}

        request.post({
                url: `${keys.secretapi}/loadallproviders.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }

            },

            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    res.send(updateSearchProviders(parsedjson.response))
                }
                else {

                    err = JSON.parse(err)
                    res.send(err);
                }

            }) // end request

    })



}
