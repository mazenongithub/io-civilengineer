const request = require("request");
const parser = require('xml2json');
module.exports = (req, res, next) => {
    if (req.user) {
        var clientid = req.user.clientid;
        var fieldid = req.params.fieldid;
        var values = { fieldid, clientid }
        return request.post({
                url: 'https://www.egeotechnical.com/xmphxp/validatefieldreport.php',
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

                        return res.status(401).send({ error: 'Unauthorized' });

                    }


                }

            }) // end request

    }
    else {
        return res.status(401).send({ error: 'Unauthorized' });
    }

};
