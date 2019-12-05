const keys = require('../../keys');
const serverkeys = require('../../../keys');
const request = require("request");
const parser = require('xml2json');
const updateAllProjects = require('../../functions/updateallprojects')
const checkLogin = require('../../functions/checkLogin');
module.exports = app => {

    app.post('/projectmanagement/:providerid/nativeclientregister', checkLogin, (req, res) => {

        request.post({
                url: `${keys.secretAPI}/updateuserprofile.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    req.session.user = { providerid: response.providerid }
                    res.send(response)
                }


            }) // end request

    })
    app.post('/projectmanagement/nativelogin', (req, res) => {
        console.log(req.body)
        request.post({
                url: `${keys.secretAPI}/loginclient.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("providerid")) {
                        req.session.user = { providerid: response.providerid }
                        response = updateAllProjects(response);
                    }

                    console.log(response)
                    res.send(response)

                }


            }) // end request

    })

}
