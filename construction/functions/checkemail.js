const request = require("request");
const keys = require('../keys');
module.exports = (req, res, next) => {

    let providerid = false;
    let url = false;
    if (req.hasOwnProperty("session")) {


        if (req.session.hasOwnProperty("user")) {

            if (req.session.user.hasOwnProperty("construction")) {


                providerid = req.session.user.construction;
                url = `https://civilengineer.io/construction/api/loadmyprofilenode.php?providerid=${providerid}`;

            }
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


                    if (response.hasOwnProperty("myuser")) {
                        if (response.myuser.emailaddress === req.params.emailaddress) {
                            res.send({ valid: req.params.emailaddress })
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
