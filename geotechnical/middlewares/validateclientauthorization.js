const request = require("request");
const parser = require('xml2json');
module.exports = (req, res, next) => {
    var projectid = req.body.projectid;
    var clientid = req.user.clientid;

    var values = { projectid, clientid }
    return request.post({
            url: 'https://www.egeotechnical.com/xmphxp/validateclientprojectid.php',
            form: values
        },
        function(err, httpResponse, body) {
            if (!err) {
                var json = parser.toJson(body);
                var parsedjson = JSON.parse(json)
                console.log(parsedjson)
                if (parsedjson.response.valid && req.user.clientid) {
                    return next();
                }
                else {

                    return res.status(401).send({ error: 'You must log in!' });

                }


            }

        }) // end request

};
