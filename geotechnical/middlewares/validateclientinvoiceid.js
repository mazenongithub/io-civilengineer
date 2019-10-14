const request = require("request");
const parser = require('xml2json');
module.exports = (req, res, next) => {
    var invoiceid = req.params.invoiceid;
    var clientid = req.user.clientid;

    var values = { invoiceid, clientid }
    return request.post({
            url: 'https://www.egeotechnical.com/xmphxp/validateclientinvoiceid.php',
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
