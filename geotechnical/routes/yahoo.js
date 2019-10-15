const keys = require('../keys');
const request = require("request");
const parser = require('xml2json');
const serverkeys = require('../../keys')
const updateUserResponse = require('../middlewares/updateUserResponse');
module.exports = app => {
    app.get('/geotechical/oauth20/yahoo/login', (req, res) => {
        let grant_type = 'authorization_code';
        let code = req.query.code;
        let values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(`${serverkeys.serverAPI}/oauth20/yahoo/login`) +
            "&client_id=" + serverkeys.yahooClientID +
            "&client_secret=" + serverkeys.yahooClientSecret
        let clientid = "";
        if (req.query.state) {
            clientid = req.query.state;
        }

        request.post({
                url: 'https://api.login.yahoo.com/oauth2/get_token',
                form: values,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            function(err, httpResponse, body) {
                if (body) {
                    body = JSON.parse(body);
                    var access_token = body.access_token;
                    if (body.hasOwnProperty("xoauth_yahoo_guid")) {

                        let values = {
                            service: 'yahoo',
                            serviceid: body.xoauth_yahoo_guid,


                        }

                        let url = "https://www.egeotechnical.com/eclient/api/loginclient.php";
                        console.log(values)
                        request.post({
                                url,
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
                                    console.log("yahoo", response)
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
                }
            })
    })


}
