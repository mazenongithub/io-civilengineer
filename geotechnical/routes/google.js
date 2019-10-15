const keys = require('../keys');
const request = require("request");
const parser = require('xml2json');
const serverkeys = require('../../keys');
const updateUserResponse = require('../middlewares/updateUserResponse');
module.exports = app => {
    app.get('/geotechnical/oauth20/google/login', (req, res) => {
        let grant_type = 'authorization_code';
        let code = req.query.code;
        let values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(`${serverkeys.serverAPI}/oauth20/google/login`) +
            "&client_id=" + serverkeys.googleClientID +
            "&client_secret=" + serverkeys.googleClientSecret

        request.post({
                url: 'https://accounts.google.com/o/oauth2/token',
                form: values,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            function(err, httpResponse, body) {
                if (body) {

                    body = JSON.parse(body);

                    var access_token = body.access_token;

                    var auth = "Bearer " + access_token;
                    request({
                        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                        headers: {
                            'Authorization': auth
                        }

                    }, function(err, response, body) {
                        if (body) {
                            body = JSON.parse(body);

                            req.session.user = body;

                            let values = {
                                service: 'google',
                                serviceid: body.id,
                                firstname: body.given_name,
                                lastname: body.family_name,
                                emailaddress: body.email
                            }

                            request.post({
                                    url: `https://www.egeotechnical.com/eclient/api/loginclient.php`,
                                    form: values,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Permission': `${keys.grantAuthorization}`
                                    }
                                },
                                function(err, httpResponse, body) {
                                    if (!err) {
                                        const json = parser.toJson(body);
                                        const parsedjson = JSON.parse(json)
                                        let response = parsedjson.response;
                                        if (response.hasOwnProperty("clientid")) {
                                            response = updateUserResponse(response);

                                            let clientid = response.clientid;
                                            req.session.user = { clientid };
                                            if (response.hasOwnProperty("validlogin")) {
                                                res.redirect(`${keys.clientAPI}/${clientid}/projects`)
                                            }
                                            else if (response.hasOwnProperty("newuser")) {
                                                res.redirect(`${keys.clientAPI}/${clientid}/completeprofile`)
                                            }
                                            else {
                                                res.redirect(`${keys.clientAPI}/client/login/Invalid login please try again`)
                                            }
                                        }
                                        else {
                                           
                                            res.redirect(`${keys.clientAPI}/client/login/Invalid login please try again`)
                                        }

                                        //values returned from DB

                                    }
                                    else {
                                        
                                        res.redirect(`${keys.clientAPI}/client/login/Invalid login please try again`)
                                    }

                                }) // end request

                        }
                        else {

                            res.redirect(`${keys.clientAPI}/client/login/Invalid login please try again`)

                        }
                    })


                }
                else {
                    res.redirect(`${keys.clientAPI}/client/login/Invalid login please try again`)

                }


            })
    })


}
