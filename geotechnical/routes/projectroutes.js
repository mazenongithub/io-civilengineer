const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');
const requireLogin = require('../middlewares/requireLogin')
module.exports = app => {

    app.get('/getclientprojectlist/request/:clientid', requireLogin, (req, res) => {
        var clientid = req.params.clientid;
        var auth = keys.EGEOTECHNICAL;
        var params = "clientid=" + clientid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/loadallprojectdata.php?" + params;

        request(url, function(err, response, body) {
            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)
                }
            }

        })

    })

    app.get('/loadprojectbyid/request/:projectid', requireLogin, (req, res) => {
        var projectid = req.params.projectid
        var auth = keys.EGEOTECHNICAL;
        var params = "projectid=" + projectid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/loadallbyprojectid.php?" + params

        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    res.send(parsedjson.response)
                }
            }

        })

    })

}
