const keys = require('../../keys');
const serverkeys = require('../../../keys');
const request = require("request");
const parser = require('xml2json');
module.exports = app => {
    app.get('/projectmanagement/oauth20/google/login', (req, res) => {
        var grant_type = 'authorization_code';
        var code = req.query.code;
        let redirect_url = `${serverkeys.SERVER_API}/projectmanagement/oauth20/google/login`
        var values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(redirect_url) +
            "&client_id=" + serverkeys.GOOGLEID +
            "&client_secret=" + serverkeys.GOOGLE_SECRET
        console.log("VALUES", values)
        request.post({
                url: 'https://accounts.google.com/o/oauth2/token',
                form: values,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            function(err, httpResponse, body) {
                if (!err) {

                    body = JSON.parse(body);

                    var access_token = body.access_token;

                    var auth = "Bearer " + access_token;
                    console.log("AUTH", auth)
                    request({
                        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
                        headers: {
                            'Authorization': auth
                        }

                    }, function(err, response, body) {

                        if (!err) {
                            console.log("BODY", body)
                            body = JSON.parse(body);

                            req.session.user = body;

                            let values = {
                                client: 'google',
                                clientid: body.id,
                                firstname: body.given_name,
                                lastname: body.family_name,
                                emailaddress: body.email
                            }


                            request.post({
                                    url: `${keys.secretAPI}/loginclient.php`,
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

                                        let providerid = "";
                                        if (response.hasOwnProperty("valid")) {

                                            providerid = response.valid;
                                            req.session.user = { providerid: response.providerid }

                                            res.redirect(`${keys.clientAPI}/${providerid}/myprojects`)

                                        }

                                        else if (response.hasOwnProperty("newuser")) {
                                            providerid = response.newuser;
                                            req.session.user = { providerid: response.providerid }
                                            res.redirect(`${keys.clientAPI}/${providerid}/completeprofile`)
                                        }
                                        else {

                                            res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)
                                        }

                                    }
                                    else {
                                        res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)
                                    }

                                    //values returned from DB


                                }) // end request

                        }
                        else {

                            res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)

                        }
                    })


                }
                else {
                    res.redirect(`${keys.clientAPI}/providers/login/Invalid login please try again`)

                }


            })
    })


}
