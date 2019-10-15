const keys = require('../keys');
var request = require("request");
const parser = require('xml2json');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: keys.AWS_ACCESS_KEY,
    secretAccessKey: keys.AWS_SECRET_ACCESS_KEY
});
module.exports = (req, res, next) => {
    let providerid = req.params.providerid;

    let values = { providerid }
    request.post({
            url: `${keys.secretapi}/getprofileurl.php`,
            form: values,
            headers: {
                'Content-Type': 'application/json',
                'Permission': `${keys.grantAuthorization}`
            }
        },
        function(err, httpResponse, body) {
            if (!err) {
                var json = parser.toJson(body);
                var parsedjson = JSON.parse(json)
                const response = parsedjson.response;

                if (response.hasOwnProperty("profileurl")) {
                    let profileurl = response.profileurl;
                    if (profileurl) {
                        if (profileurl.search('goandhireme') !== -1) {
                            let keypos = profileurl.lastIndexOf('/');
                            let Key = profileurl.substr(keypos + 1);
                            var params = {
                                Bucket: "goandhireme",
                                Key
                            };

                            s3.deleteObject(params, function(err, data) {
                                if (err) {

                                    next(); // an error occurred
                                }
                                else {

                                    next();
                                }
                            });

                        }
                        else {
                            next();
                        } //  not mine

                    }
                    else {
                        next();
                    }

                }
                else {

                    next();
                } // else will never run, response has profileurl


            }

        }) // end request


}
