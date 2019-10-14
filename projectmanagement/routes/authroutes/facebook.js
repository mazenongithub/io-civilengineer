const keys = require('../../keys/keys');
const request = require("request");
const parser = require('xml2json');

module.exports = app => {
    app.get('/oauth20/facebook', (req, res) => {
        const grant_type = 'authorization_code';
        const code = req.query.code;
        let commission = "";
        if (req.query.hasOwnProperty("state")) {
            commission = req.query.state;
        }
        const redirect_uri = `${keys.rootserver}/oauth20/facebook`
        const values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(redirect_uri) +
            "&client_id=" + keys.facebookappid +
            "&client_secret=" + keys.facebookappsecret

        request({
                url: `https://graph.facebook.com/v3.2/oauth/access_token?${values}`
            },
            function(err, httpResponse, body) {
                if (!body.hasOwnProperty(("error"))) {

                    body = JSON.parse(body);
                    var access_token = body.access_token;
                    var auth = "Bearer " + access_token;

                    request({
                        url: `https://graph.facebook.com/v3.2/me`,
                        headers: {
                            'Authorization': auth,
                            'Accept': 'application/json'
                        }

                    }, function(err, response, body) {
                        if (!err) {
                            body = JSON.parse(body);
                            console.log(body)
                            if (body.hasOwnProperty("id")) {
                                //let response ={name: 'Mazen Khenaisser', id: '1794898040532001'}
                                let space = body.name.search(" ")
                                let firstname = body.name.substring(0, space)
                                let lastname = body.name.substring(space)
                                let client = "facebook";
                                let clientid = body.id;
                                let values = { firstname, lastname, client, clientid, providerid: commission }
                                console.log(values)
                                request.post({
                                        url: `${keys.secretapi}/registerclient.php`,
                                        form: values,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Permission': `${keys.grantAuthorization}`
                                        }
                                    },
                                    function(err, httpResponse, body) {
                                        if (!err) {
                                            var json = parser.toJson(body);
                                            var parsedjson = JSON.parse(json)

                                            if (parsedjson.response.hasOwnProperty("providerid")) {

                                                req.session.user = parsedjson.response
                                                if (!parsedjson.response.hasOwnProperty("userfound")) {
                                                    res.redirect(`${keys.rootclient}/profile/client`)
                                                }
                                                else {
                                                    res.redirect(`${keys.rootclient}`)
                                                }
                                            }
                                            else {
                                                const message = encodeURIComponent("Invalid login please try again")
                                                res.redirect(keys.rootclient + "/login/" + message)
                                            }

                                            //values returned from DB

                                        }

                                    }) // end request












                            }
                            else {
                                let message = encodeURIComponent("Invalid login please try again")
                                res.redirect(keys.rootclient + "/login/" + message)
                            }


                        }
                        else {
                            let message = encodeURIComponent("Invalid login please try again")
                            res.redirect(keys.rootclient + "/login/" + message)
                        }
                    })


                }
                else {
                    let message = encodeURIComponent("Invalid login please try again")
                    res.redirect(keys.rootclient + "/login/" + message)
                }


            })
    })



    app.get('/oauth20/facebook/login', (req, res) => {
        const grant_type = 'authorization_code';
        const code = req.query.code;
        const redirect_uri = `${keys.rootserver}/oauth20/facebook/login`
        const values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(redirect_uri) +
            "&client_id=" + keys.facebookappid +
            "&client_secret=" + keys.facebookappsecret;

        request({
                url: `https://graph.facebook.com/v3.2/oauth/access_token?${values}`
            },
            function(err, httpResponse, body) {

                body = JSON.parse(body);
                console.log(body)

                var access_token = body.access_token;
                var auth = "Bearer " + access_token;

                request({
                    url: `https://graph.facebook.com/v3.2/me`,
                    headers: {
                        'Authorization': auth,
                        'Accept': 'application/json'
                    }

                }, function(err, response, body) {

                    body = JSON.parse(body);
                    console.log(body)
                    if (body.hasOwnProperty("id")) {
                        //let response ={name: 'Mazen Khenaisser', id: '1794898040532001'}
                        let space = body.name.search(" ")
                        let firstname = body.name.substring(0, space)
                        let lastname = body.name.substring(space)
                        let client = "facebook";
                        let clientid = body.id;
                        let values = { client, clientid, firstname, lastname }


                        request.post({
                                url: `${keys.secretapi}/loginclient.php`,
                                form: values,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Permission': `${keys.grantAuthorization}`
                                }
                            },
                            function(err, httpResponse, body) {

                                var json = parser.toJson(body);
                                var parsedjson = JSON.parse(json)

                                if (parsedjson.response.hasOwnProperty("providerid")) {
                                    req.session.user = parsedjson.response
                                    if (parsedjson.response.hasOwnProperty("newuser")) {
                                        res.redirect(`${keys.rootclient}/profile/client`)
                                    }
                                    else {
                                        res.redirect(`${keys.rootclient}`)
                                    }

                                }
                                else {
                                    let message = "";
                                    if (body.hasOwnProperty("error")) {
                                        message += body.error.message
                                    }
                                    if (!message) {
                                        message = encodeURIComponent("Invalid login please try again")
                                    }
                                    res.redirect(keys.rootclient + "/login/" + message)

                                }


                                //values returned from DB



                            }) // end request

                    }
                    else {
                        let message = "";
                        if (body.hasOwnProperty("error")) {
                            message += body.error.message
                        }
                        if (!message) {
                            message = encodeURIComponent("Invalid login please try again")
                        }
                        res.redirect(keys.rootclient + "/login/" + message)

                    }
                })




            })
    })

}
