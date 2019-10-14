const request = require("request");
const parser = require('xml2json');
module.exports = (req, res, next) => {
    let invoiceid = req.params.invoiceid;
    if (req.hasOwnProperty("session")) {
        if (req.session.hasOwnProperty("user")) {
            if (req.session.user.hasOwnProperty("clientid")) {

                let clientid = req.session.user.clientid;
                let values = { clientid, invoiceid }
                return request.post({
                        url: 'https://www.egeotechnical.com/eclient/api/validateclientinvoiceid.php',
                        form: values
                    },
                    function(err, httpResponse, body) {
                        if (!err) {
                            var json = parser.toJson(body);
                            var parsedjson = JSON.parse(json)
                            let response = parsedjson.response;
                            if (response.hasOwnProperty("valid")) {

                                return next();
                            }
                            else {
                                if (response.hasOwnProperty("message")) {
                                    let message = response.message;
                                    return res.status(401).send({ message });
                                }
                                else {
                                    return res.status(401).send({ message: "could not process request" });
                                }

                            }


                        }

                    }) // end request

            }
        }
        else {

            return res.status(401).send({ error: 'You must be logged in to access this location' });
        }
    }
    else {
        return res.status(401).send({ error: 'You must be logged in to access this location' });
    }
    var values = { projectid, invoiceid }

    return request.post({
            url: 'https://www.egeotechnical.com/xmphxp/validateclientprojectid.php',
            form: values
        },
        function(err, httpResponse, body) {
            if (!err) {
                var json = parser.toJson(body);
                var parsedjson = JSON.parse(json)
                if (parsedjson.response.valid && req.user.clientid) {
                    return next();
                }
                else {



                }


            }

        }) // end request

};
