const keys = require('../../keys/keys');
var request = require("request");
module.exports = app => {
    app.get('/oauth20/linkedin', (req, res) => {
        console.log(req.query)
        var grant_type = 'authorization_code';
        var code = req.query.code;
        var values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(`${keys.rootserver}/oauth20/linkedin`) +
            "&client_id=" + keys.linkedinclientid +
            "&client_secret=" + keys.linkedinclientsecret
        console.log(values)
        request.post({
                url: 'https://www.linkedin.com/uas/oauth2/accessToken',
                form: values,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            function(err, httpResponse, body) {
                if (!err) {
                    console.log(body)
                    body = JSON.parse(body);
                    var access_token = body.access_token;
                    console.log(access_token)
                    var auth = "Bearer " + access_token;
                    request({
                        url: 'https://api.linkedin.com/v2/me?format=json',
                        headers: {
                            'Authorization': auth
                        }

                    }, function(err, response, body) {
                        if (!err) {

                            body = JSON.parse(body);
                            console.log(body)
                            if (body.status > 400 && body.status < 500) {

                                let message = `Invalid Application, LinkedIn Status Code: ${body.status} ${body.message.replace("/"," ")}`

                                res.redirect(keys.rootclient + "/login/" + message)

                            }
                            else {
                                res.redirect(`${keys.rootclient}`)
                            }

                        }
                        else {
                            res.send(err)
                        }
                    })


                }
                else {
                    res.send(err)
                }


            })
    })


    app.get('/oauth20/linkedin/login', (req, res) => {
        var grant_type = 'authorization_code';
        var code = req.query.code;
        var values = "grant_type=" + grant_type +
            "&code=" + code +
            "&redirect_uri=" + encodeURIComponent(keys.linkedin_redirecturl) +
            "&client_id=" + keys.linkedinclientid +
            "&client_secret=" + keys.linkedinclientsecret

        request.post({
                url: 'https://www.linkedin.com/uas/oauth2/accessToken',
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
                    request({
                        url: 'https://api.linkedin.com/v2/me?format=json',
                        headers: {
                            'Authorization': auth
                        }

                    }, function(err, response, body) {
                        if (!err) {
                            body = JSON.parse(body);

                            if (body.status > 400 && body.status < 500) {
                                let message = `Invalid Application, LinkedIn Status Code: ${body.status} ${body.message}`

                                res.redirect(keys.rootclient + "/login/" + message)
                            }
                            else {
                                res.redirect(`${keys.rootclient}`)
                            }

                        }
                        else {
                            res.send(err)
                        }
                    })


                }
                else {
                    res.send(err)
                }


            })
    })

}
