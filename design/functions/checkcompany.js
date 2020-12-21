const request = require("request");
const keys = require('../keys');
module.exports = (req, res, next) => {
    const companyurl = req.params.companyurl;
    let providerid = false;
    let url = false;
    if (req.hasOwnProperty("session")) {


        if (req.session.hasOwnProperty("design")) {

            providerid = req.session.design;
            url = `https://civilengineer.io/design/api/loadprofile.php?providerid=${providerid}`

        }


    }


    if (providerid && url) {

        request.get(url, {
                headers: {
                    'Permission': `${keys.grantAuthorization}`
                }

            },
            function(err, httpResponse, body) {

                try {

                    let response = JSON.parse(body)


                    if (response.hasOwnProperty("myuser")) {
                        if (response.myuser.hasOwnProperty("company")) {
                            if (response.myuser.company.url === companyurl) {
                                res.send({ valid: companyurl })
                            }
                            else {
                                next();
                            }
                        }
                        else {
                            next();
                        }

                    }

                    else {
                        res.status(404).send({ message: `Could not check company, user not found ${response.myuser.providerid}` })

                    }
                    //values returned from DB

                }
                catch (error) {

                    res.status(404).send({ message: `Could not make server request ${error} ${err}` })
                }

            }) // end request

    }

    else {
        res.status(404).send({ message: `Could not check company, no user found` })
    }




}
