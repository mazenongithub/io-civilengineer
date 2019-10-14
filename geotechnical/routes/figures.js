const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');
const validateclientprojectid = require('../middlewares/validateclientprojectid')
module.exports = app => {

    app.get('/getprojectfigure/:projectid/figure/:figurenumber', validateclientprojectid, (req, res) => {
        let projectid = req.params.projectid;
        let figurenumber = req.params.figurenumber;
        console.log(projectid, figurenumber)
        var auth = keys.EGEOTECHNICAL;
        var params = "projectid=" + projectid +
            "&figurenumber=" + figurenumber +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/findprojectfigure.php?" + params;
        console.log(url)
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
