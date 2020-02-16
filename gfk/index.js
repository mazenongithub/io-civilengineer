const keys = require('./keys');
const request = require("request");
const parser = require('xml2json');
const updateUser = require('./functions/updateuser');
const updateFieldReports = require('./functions/updatefieldreports')
const uploadfieldimage = require('./functions/uploadfieldimage')
module.exports = app => {

    app.post('/gfk/:imageid/uploadfieldimage', uploadfieldimage, (req, res) => {
        console.log(req.body)
        if (req.body.image) {
            res.send({ image: req.body.image })
        }
        else {
            res.send({ error: 'Could not upload image' })
        }
    })

    app.get('/gfk/:engineerid/loadmyprofile', (req, res) => {

        request.get({
                url: `https://civilengineer.io/gfk/api/loadprofile.php?engineerid=${req.params.engineerid}`,
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                try {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    response = updateUser(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    console.log(err)
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request

    })

    app.post('/gfk/:projectid/savefieldreport', (req, res) => {

        console.log(req.body)
        request.post({
                url: 'https://civilengineer.io/gfk/api/savefieldreport.php',
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
                    response = updateFieldReports(response)
                    res.send(response)
                    //values returned from DB

                }
                catch (err) {
                    console.log(err)
                    res.status(404).send({ message: 'Server is not responding' })
                }

            }) // end request
    })




}
