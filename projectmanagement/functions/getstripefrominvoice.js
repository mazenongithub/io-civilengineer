const keys = require('../keys');
const request = require("request");
const parser = require('xml2json');
module.exports = (req, res, next) => {
    //ensures allprojeccts are arrays
    let invoiceid = req.params.invoiceid;
    let projectid = req.params.projectid;
    let providerid = req.params.providerid;


    let values = { providerid, invoiceid, projectid }

    request.post({
            url: 'https://www.goandhireme.com/api/getstripeprofile.php',
            form: values,
            headers: {
                'Content-Type': 'application/json',
                'Permission': `${keys.grantAuthorization}`
            }
        },
        function(err, httpResponse, body) {
            if (body) {
                var json = parser.toJson(body);
                var parsedjson = JSON.parse(json)
                let response = parsedjson.response;
                req.body.stripe = response.stripe;
                req.body.commission = response.commission;
                next();


            }
            else {
                res.send({ errorMessage: "Could not make request" });
            }
        })

}
