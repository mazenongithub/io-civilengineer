const keys = require('../../keys');
const serverkeys = require('../../../keys');
const request = require("request");
const parser = require('xml2json');
const updateAllProjects = require('../../functions/updateallprojects')
module.exports = app => {
    app.post('/projectmanagement/nativelogin', (req, res) => {
        //let values = { client: 'apple', clientid: 'udderedssdd8444.u', firstname: 'Mazen', lastname: 'Khenaisser', emailaddress: 'mazen@civilengineer.io' }
        console.log(req.body)
        request.post({
                url: `${keys.secretAPI}/loginclient.php`,
                form: req.body,
                headers: {
                    'Content-Type': 'application/json',
                    'Permission': `${keys.grantAuthorization}`
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    let response = parsedjson.response;
                    response = updateAllProjects(response);
                    console.log(response)
                    res.send(response)

                }


            }) // end request

    })

}
