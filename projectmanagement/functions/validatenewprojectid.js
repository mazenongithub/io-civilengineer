const keys = require('../keys');
const request = require("request");
const parser = require('xml2json');
module.exports = (req, res, next) => {
    //ensures allprojeccts are arrays
    let projectid = req.body.projectid;


    let values = { projectid }

    request.post({
            url: 'https://www.goandhireme.com/api/checknewprojectid.php',
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

                if (!response.hasOwnProperty("invalid")) {
                    next();
                }
                else {
                    res.send(response)
                }



            }
            else {
                res.send({ errorMessage: "Could not make request" });
            }
        })

}
