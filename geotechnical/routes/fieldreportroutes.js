const request = require("request");
const parser = require('xml2json');
const requireLogin = require('../middlewares/requireLogin');
const validatefieldreport = require('../middlewares/validatefieldreport');
const keys = require('../keys/keys');
module.exports = app => {

    app.get('/api/fieldreports/:fieldid', validatefieldreport, (req, res) => {
        var fieldid = req.params.fieldid;
        var auth = keys.EGEOTECHNICAL;
        var params = "fieldid=" + fieldid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/findfieldreportclient.php?" + params;

        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    console.log(parsedjson.response)
                    res.send(parsedjson.response)
                }
            }
            //        
            //        
            //        
            //


        })

    })



}
