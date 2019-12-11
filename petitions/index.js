const request = require("request");
const parser = require('xml2json');
const keys = require('./keys');


module.exports = app => {

    app.get('/petitions/:userid', (req, res) => {
        let userid = req.params.userid;
        let url = `http://civilengineer.io/petitions/api/loadmyprofile.php?userid=${userid}`
        try {
            request({
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Permission': `${keys.grantAuthorization}`
                    }
                },
                function(err, httpResponse, body) {
                    if (!err) {
                        let json = parser.toJson(body);
                        let parsedjson = JSON.parse(json);
                        let myuser = parsedjson.myuser;

                        res.send({ myuser });
                    }
                    else {

                        const errorMessage = `There was an error requesting the projects  ${url}`
                        res.send({ errorMessage });
                    }

                }) // end request

        }
        catch (err) {
            res.send({ error: err })
        }


    })

}
