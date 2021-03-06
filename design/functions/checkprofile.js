const request = require("request");
const keys = require('../keys');
module.exports = (req, res, next) => {

    let providerid = false;
    let url = false;
    if (req.hasOwnProperty("session")) {



        if (req.session.hasOwnProperty("design")) {


            providerid = req.session.design;
            url = `https://civilengineer.io/design/api/loadprofile.php?profile=${providerid}`;


        }


    }

    if (providerid) {

        request.get(url, {
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {
                try {

                    let response = JSON.parse(body)
                    console.log(response)

                    if (response.hasOwnProperty("myuser")) {
                        if (response.myuser.profile.toLowerCase() === req.params.profile.toLowerCase()) {
                            res.send({ valid: req.params.profile })
                        }
                        else {

                            next();
                        }
                    }
                    //values returned from DB

                }
                catch (error) {

                    res.status(404).send({ message: `Could not make server request ${error} ${err}` })
                }

            }) // end request

    }
    else {
        next();
    }






}
