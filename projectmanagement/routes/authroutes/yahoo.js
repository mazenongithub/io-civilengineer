const keys = require('../../keys');
const serverkeys = require('../../../keys');
const request = require("request");
const parser = require('xml2json');

module.exports = app => {
    app.get('/projectmanagement/oauth20/yahoo/login', (req, res) => {
        let grant_type = 'authorization_code';
        let code = req.query.code;
        let values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(`${serverkeys.SERVER_API}/projectmanagement/oauth20/yahoo/login`) +
            "&client_id=" + serverkeys.YAHOOID +
            "&client_secret=" + serverkeys.YAHOO_SECRET
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
                            client: 'yahoo',
                            clientid: body.xoauth_yahoo_guid

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
                                if (!err) {
                                    const json = parser.toJson(body);
                                    const parsedjson = JSON.parse(json)
                                    let response = parsedjson.response;

                                    if (response.hasOwnProperty("valid")) {

                                        let providerid = response.providerid;
                                        req.session.user = { providerid: response.providerid }

                                        res.redirect(`${keys.rootclient}/${providerid}/myprojects`)

                                    }

                                    else if (response.hasOwnProperty("newuser")) {
                                        let providerid = response.newuser;
                                        req.session.user = { providerid: response.providerid }
                                        res.redirect(`${keys.rootclient}/${providerid}/completeprofile`)
                                    }
                                    else {

                                        res.redirect(`${keys.rootclient}/providers/login/Invalid login please try again`)
                                    }
                                }

                            }) // end request




                    }
                    else {
                        res.redirect(`${keys.rootclient}/providers/login/Invalid login please try again`)

                    }
                }
            })
    })


}
