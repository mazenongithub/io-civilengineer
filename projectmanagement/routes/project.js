const keys = require('../keys');
var request = require("request");
const parser = require('xml2json');
const setAllProjectArrays = require('../functions/updateproject');
const updateAllProjects = require('../functions/updateallprojects')
const updateProjectCosts = require('../functions/updateprojectcosts');
const updateProjectSchedule = require('../functions/updateprojectschedule');
const updateProjectTeam = require('../functions/updateprojectteam');
const updateSearchProviders = require('../functions/updatesearchproviders');
const validatenewprojectid = require('../functions/validatenewprojectid');
const updateAllUsers = require('../../construction/functions/updateallusers');
const checkLogin = require('../functions/checkLogin');
module.exports = app => {

    app.post('/projectmanagement/:providerid/projects/:projectid/insertinvoice', checkLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/insertinvoice.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response)
                    res.send(response);
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request


    })

    app.post('/projectmanagement/:providerid/projects/:projectid/insertproposal', checkLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/insertproposal.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response)
                    res.send(response);
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })




    app.post('/projectmanagement/:providerid/projects/:projectid/saveallprojects', checkLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/saveallprojects.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response)
                    res.send(response);
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request


    })
    app.post('/projectmanagement/:providerid/saveallprofile', (req, res) => {
        console.log(req.body)
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
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response);
                    response = updateAllUsers(response);
                    res.send(response)
                }
                catch (err) {
                    console.log(err)

                    res.status(404).send({ message: 'Server Could Not Load Response, Please Try again later' })
                }

            }) // end request


    })
    app.post('/projectmanagement/:providerid/projects/:projectid/providerendpoint', checkLogin, (req, res) => {

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/providerendpoint.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response)
                    res.send(response);
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })
    app.post('/projectmanagement/:providerid/projects/insertmyproject', (req, res) => {

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/insertmyproject.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    res.send(response);
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
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
                url: `https://civilengineer.io/projectmanagement/api/deletemyproject.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json);
                    res.send(parsedjson.response);
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request


    })

    app.get('/projectmanagement/:providerid/projects/loadmyproject', checkLogin, (req, res) => {
        let providerid = req.params.providerid;
        let values = { providerid }
        const url = `https://civilengineer.io/projectmanagement/api/loadmyprojects.php`;

        request.post({
                url,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json);
                    let response = parsedjson.response;
                    response = updateAllProjects(response);
                    res.send(response);
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request


    })


    app.get('/projectmanagement/loadmyproviders', (req, res) => {

        let values = {}

        request.post({
                url: `https://civilengineer.io/projectmanagement/api/loadallproviders.php`,
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

                    res.send(updateSearchProviders(parsedjson.response))
                }
                catch (err) {

                    res.status(404).send({ message: 'API failure could not load response' })
                }

            }) // end request

    })



}
