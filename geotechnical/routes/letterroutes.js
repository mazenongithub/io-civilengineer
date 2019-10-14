const request = require("request");
const parser = require('xml2json');
const requireLogin = require('../middlewares/requireLogin');
const validateletterid = require('../middlewares/validateletterid');
const keys = require('../keys/keys');
const updateLetterContent = require('../functions/updatelettercontent');
module.exports = app => {

    app.get('/letters/:clientid/getall', requireLogin, (req, res) => {
        var clientid = req.params.clientid;
        var auth = keys.EGEOTECHNICAL;
        var params = "clientid=" + clientid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/loadallmyletters.php?" + params;

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
            //        
            //        
            //        
            //


        })

    })

    app.get('/letters/:letterid/show', validateletterid, (req, res) => {
        var letterid = req.params.letterid;
        var auth = keys.EGEOTECHNICAL;
        var params = "letterid=" + letterid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/findclientletterbyid.php?" + params;
        console.log(url)
        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    const response = updateLetterContent(parsedjson.response)
                    //console.log(parsedjson)
                    res.send(response)
                }
            }
            //        
            //        
            //        
            //


        })

    })

}
