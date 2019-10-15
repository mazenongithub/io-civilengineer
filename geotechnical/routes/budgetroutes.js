const request = require("request");
const parser = require('xml2json');
const keys = require('../keys');
const requireLogin = require('../middlewares/requireLogin');
const validateprojectclientid = require('../middlewares/validateclientprojectid');
const validateclientauthorization = require('../middlewares/validateclientauthorization');
const updateUserResponse = require('../middlewares/updateUserResponse');
module.exports = app => {


    app.post('/geotechnical/:clientid/budget/:projectid/authorize', requireLogin, (req, res) => {
        var clientid = req.body.clientid;
        var projectid = req.body.projectid;

        var values = { clientid, projectid }

        request.post({
                url: 'https://www.egeotechnical.com/eclient/api/clientupdate.php',
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
                    //values returned from DB

                }

            }) // end request

    })

}
