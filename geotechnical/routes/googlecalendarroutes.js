const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');
const base64url = require("base64url");
var crypto = require('crypto');
const checkLogin = require('../middlewares/checkLogin');
const requireLogin = require('../middlewares/requireLogin');
const checkProjectID = require('../middlewares/checkProjectID');
module.exports = app => {
    app.get('/googlecalendar/:clientid/showmyevents', requireLogin, (req, res) => {
        var clientid = req.params.clientid;
        var auth = keys.EGEOTECHNICAL;
        var params = "clientid=" + clientid +
            "&auth=" + auth;

        var url = "https://www.egeotechnical.com/xmphxp/loadmyevents.php?" + params;

        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)

                    res.send(parsedjson.response)
                }
            }

        })

    })


    app.post('/googlecalendar/insertevent', checkLogin, checkProjectID, (req, res) => {
        var eventtitle = req.body.eventtitle;
        var description = req.body.description;
        var start = req.body.starttime;
        var end = req.body.endtime;
        var projectid = req.body.projectid;
        var private_key = keys.googleprivatekey;
        var attendees = req.body.attendees;
        var iat = Math.round(new Date() / 1000);
        var exp = iat + 3600;
        // data from your file would go here
        var baseheader = { "alg": "RS256", "typ": "JWT" };
        baseheader = JSON.stringify(baseheader);
        baseheader = base64url(baseheader);
        var claimSet = {
            "iss": "egeotechnical@egeotechnical-199216.iam.gserviceaccount.com",
            "scope": "https://www.googleapis.com/auth/calendar",
            "aud": "https://accounts.google.com/o/oauth2/token",
            "exp": exp,
            "iat": iat
        }
        claimSet = JSON.stringify(claimSet);
        claimSet = base64url(claimSet)
        const sign = crypto.createSign('RSA-SHA256');
        //console.log(baseheader + "." + claimSet)
        sign.update(baseheader + "." + claimSet);
        var mysignature = sign.sign(keys.googleprivatekey, 'base64');
        mysignature = encodeURIComponent(mysignature)
        var jwt = baseheader + "." + claimSet + "." + mysignature;
        var grant_type = 'urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer';
        var values = "grant_type=" + grant_type +
            "&assertion=" + jwt;

        request.post({
                url: 'https://accounts.google.com/o/oauth2/token',
                body: values,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            function(err, httpResponse, body) {
                if (!err) {

                    body = JSON.parse(body);
                    var access_token = body.access_token;
                    var auth = "Bearer " + access_token
                    var event = {
                        summary: eventtitle,
                        description: description,
                        start: {
                            dateTime: start
                            //dateTime: "2018-06-07T19:00:00-07:00"
                        },
                        end: {
                            dateTime: end
                        },
                        attendees: attendees,
                        visibility: "private",
                        extendedProperties: {
                            private: {
                                everyoneDeclinedDismissed: "-1"
                            }
                        },
                        guestsCanInviteOthers: false,
                        reminders: {
                            useDefault: true
                        }
                    }

                    event = JSON.stringify(event)

                    request.post({
                        url: 'https://www.googleapis.com/calendar/v3/calendars/np4qfs6med0m5qpiv00peg48bk@group.calendar.google.com/events',
                        body: event,
                        headers: {
                            'Authorization': auth,
                            'Content-Type': 'application/json'
                        }

                    }, function(err, response, body) {
                        if (!err) {
                            body = JSON.parse(body);
                            var eventid = body.id;
                            var description = body.description;
                            var starttime = body.start.dateTime;
                            var endtime = body.end.dateTime;
                            var values = { eventid, description, starttime, endtime, projectid, eventtitle }
                            JSON.stringify(values);
                            //res.send(values)

                            request.post({
                                    url: 'https://www.egeotechnical.com/xmphxp/insertclientevents.php',
                                    form: values,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                },
                                function(err, httpResponse, body) {
                                    if (!err) {
                                        var json = parser.toJson(body);
                                        var parsedjson = JSON.parse(json)
                                        res.send(parsedjson.response);
                                        //values returned from DB

                                    }

                                }) // end request



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


    app.post('/googlecalendar/updatevent', checkLogin, checkProjectID, (req, res) => {
        var eventtitle = req.body.eventtitle;
        var description = req.body.description;
        var start = req.body.starttime;
        var end = req.body.endtime;
        var projectid = req.body.projectid;
        var eventid = req.body.eventid;
        var attendees = req.body.attendees;
        var private_key = keys.googleprivatekey;
        var iat = Math.round(new Date() / 1000);
        var exp = iat + 3600;
        // data from your file would go here
        var baseheader = { "alg": "RS256", "typ": "JWT" };
        baseheader = JSON.stringify(baseheader);
        baseheader = base64url(baseheader);
        var claimSet = {
            "iss": "egeotechnical@egeotechnical-199216.iam.gserviceaccount.com",
            "scope": "https://www.googleapis.com/auth/calendar",
            "aud": "https://accounts.google.com/o/oauth2/token",
            "exp": exp,
            "iat": iat
        }
        claimSet = JSON.stringify(claimSet);
        claimSet = base64url(claimSet)
        const sign = crypto.createSign('RSA-SHA256');

        //console.log(baseheader + "." + claimSet)
        sign.update(baseheader + "." + claimSet);
        var mysignature = sign.sign(keys.googleprivatekey, 'base64');
        mysignature = encodeURIComponent(mysignature)
        var jwt = baseheader + "." + claimSet + "." + mysignature;
        var grant_type = 'urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer';
        var values = "grant_type=" + grant_type +
            "&assertion=" + jwt;

        request.post({
                url: 'https://accounts.google.com/o/oauth2/token',
                body: values,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            function(err, httpResponse, body) {


                if (!err) {
                    body = JSON.parse(body);
                    var access_token = body.access_token;
                    var auth = "Bearer " + access_token
                    var event = {
                        summary: eventtitle,
                        description: description,
                        start: {
                            dateTime: start
                            //dateTime: "2018-06-07T19:00:00-07:00"
                        },
                        end: {
                            dateTime: end
                        },
                        attendees: attendees,
                        visibility: "private",
                        extendedProperties: {
                            private: {
                                everyoneDeclinedDismissed: "-1"
                            }
                        },
                        guestsCanInviteOthers: false,
                        reminders: {
                            useDefault: true
                        }
                    }

                    event = JSON.stringify(event)
                    //res.send(event);
                    request.put({
                        url: 'https://www.googleapis.com/calendar/v3/calendars/np4qfs6med0m5qpiv00peg48bk@group.calendar.google.com/events/' + eventid,
                        body: event,
                        headers: {
                            'Authorization': auth,
                            'Content-Type': 'application/json'
                        }

                    }, function(err, response, body) {
                        if (!err) {
                            body = JSON.parse(body)
                            var values = {
                                eventid: body.id,
                                description: body.description,
                                starttime: body.start.dateTime,
                                endtime: body.end.dateTime,
                                projectid
                            }
                            JSON.stringify(values);
                            //res.send(values)
                            console.log(values)
                            request.post({
                                    url: 'https://www.egeotechnical.com/xmphxp/insertclientevents.php',
                                    form: values,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                },
                                function(err, httpResponse, body) {
                                    if (!err) {
                                        var json = parser.toJson(body);
                                        var parsedjson = JSON.parse(json)
                                        res.send(parsedjson.response);
                                        //values returned from DB

                                    }

                                }) // end request
                        }
                        else {

                            var errmessage = err;
                            var error = { errmessage }
                            error = JSON.stringify(error)
                            res.send(error)
                        }

                    })


                }
            })
    })

    app.get('/googlecalendar/:eventid/deleteevent', checkLogin, (req, res) => {
        var eventid = req.params.eventid;
        var private_key = keys.googleprivatekey;
        var iat = Math.round(new Date() / 1000);
        var exp = iat + 3600;
        // data from your file would go here
        var baseheader = { "alg": "RS256", "typ": "JWT" };
        baseheader = JSON.stringify(baseheader);
        baseheader = base64url(baseheader);
        var claimSet = {
            "iss": "egeotechnical@egeotechnical-199216.iam.gserviceaccount.com",
            "scope": "https://www.googleapis.com/auth/calendar",
            "aud": "https://accounts.google.com/o/oauth2/token",
            "exp": exp,
            "iat": iat
        }
        claimSet = JSON.stringify(claimSet);
        claimSet = base64url(claimSet)
        const sign = crypto.createSign('RSA-SHA256');
        //console.log(baseheader + "." + claimSet)
        sign.update(baseheader + "." + claimSet);
        var mysignature = sign.sign(keys.googleprivatekey, 'base64');
        mysignature = encodeURIComponent(mysignature)
        var jwt = baseheader + "." + claimSet + "." + mysignature;
        var grant_type = 'urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer';
        var values = "grant_type=" + grant_type +
            "&assertion=" + jwt;

        request.post({
                url: 'https://accounts.google.com/o/oauth2/token',
                body: values,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            },
            function(err, httpResponse, body) {
                if (!err) {

                    body = JSON.parse(body);
                    var access_token = body.access_token;
                    var auth = "Bearer " + access_token

                    request.delete({
                        url: 'https://www.googleapis.com/calendar/v3/calendars/np4qfs6med0m5qpiv00peg48bk@group.calendar.google.com/events/' + eventid,
                        headers: {
                            'Authorization': auth
                        }


                    }, function(err, response, body) {
                        if (!err) {
                            var clientid = "";
                            if (req.user) {
                                clientid = req.user.clientid
                            }

                            var params = "clientid=" + clientid +
                                "&eventid=" + eventid;

                            request.post({
                                    url: 'https://www.egeotechnical.com/xmphxp/deleteclientevent.php',
                                    form: params,
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    }
                                },
                                function(err, httpResponse, body) {
                                    if (!err) {
                                        var json = parser.toJson(body);
                                        var parsedjson = JSON.parse(json)
                                        res.send(parsedjson.response);

                                    }

                                }) // end request

                        }
                        else {
                            console.log(err)
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
