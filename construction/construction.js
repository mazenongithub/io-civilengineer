const keys = require('./keys');
const request = require("request");
const parser = require('xml2json');
const updateUserResponse = require('./functions/updateuserresponse')
module.exports = app => {

    app.get('/construction/:providerid/loaduserprofile', (req, res) => {

        let providerid = req.params.providerid;

        request.get(`http://civilengineer.io/construction/api/loadmyprofile.php?providerid=${providerid}`, {
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                if (body) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    response = updateUserResponse(response)
                    res.send(response)
                    //values returned from DB

                }

            }) // end request


    })


}
