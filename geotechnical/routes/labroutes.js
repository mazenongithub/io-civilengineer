const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');

const validateprojectclientid = require('../middlewares/validateclientprojectid');

module.exports = app => {


    app.get('/findlabsummary/:projectid/show', validateprojectclientid, (req, res) => {
        var projectid = req.params.projectid;
        var auth = keys.EGEOTECHNICAL;
        var params = "projectid=" + projectid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/loadclientlabsummary.php?" + params;
        console.log(url)
        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    console.log(parsedjson)
                    res.send(parsedjson.response)
                }
            }

        })

    })


}
