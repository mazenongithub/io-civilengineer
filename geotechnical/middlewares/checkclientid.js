const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');
module.exports = (req, res, next) => {;
    let clientid = req.body.clientid
    let values = { clientid }
    let oldclientid = "";
    if (req.hasOwnProperty("params")) {
        oldclientid = req.params.clientid;
    }
    if (clientid !== oldclientid) {
        request.post({
                url: `https://www.egeotechnical.com/eclient/api/checkclientid.php`,
                form: values,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    let json = parser.toJson(body);
                    let parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    if (response.hasOwnProperty("valid")) {
                        return next();
                    }
                    else {

                        res.redirect(`${keys.clientAPI}/newclient/register`)
                    }
                }
                else {
                    res.redirect(`${keys.clientAPI}/newclient/register`)
                }

            }) // end request  
    }
    else {
        return next();
    }
};
