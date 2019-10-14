const request = require("request");
const parser = require('xml2json');
const keys = require('../keys/keys');
const authenticatebyclient = require('../middlewares/requireLogin');
const checkservicerequest = require('../middlewares/checkservicerequest');
const validateinsertrequest = require('../middlewares/validateinsertservicerequest');
module.exports = app => {
    app.get('/servicerequest/:clientid/showall', authenticatebyclient, (req, res) => {

        var clientid = req.params.clientid;
        var auth = keys.EGEOTECHNICAL;
        var params = "clientid=" + clientid +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/loadallservicerequest.php?" + params;

        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    console.log(parsedjson)
                    res.send(parsedjson.response)
                }
            }

        })

    })

    app.get('/servicerequest/:servicerequest/show', checkservicerequest, (req, res) => {
        var servicerequest = req.params.servicerequest
        var auth = keys.EGEOTECHNICAL;
        var params = "servicerequest=" + servicerequest +
            "&auth=" + auth;
        var url = "https://www.egeotechnical.com/xmphxp/findmyservicerequest.php?" + params;
       
        request(url, function(err, response, body) {

            if (err) {
                console.log("something went wrong")
            }
            else {
                if (response.statusCode == 200) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    console.log(parsedjson)
                    res.send(parsedjson.response)
                }
            }

        })

    })

    app.post('/servicerequest/insertupdate', validateinsertrequest, (req, res) => {
        var values = {
            clientid: req.body.clientid,
            servicerequest: req.body.servicerequest,
            projectaddress: req.body.projectaddress,
            projectcity: req.body.projectcity,
            projectstate: req.body.projectstate,
            projectcounty: req.body.projectcounty,
            projectapn: req.body.projectapn,
            proposed: req.body.proposed,
            proposedproject: req.body.proposedproject,
            title: req.body.title,
            siteaccess: req.body.siteaccess,
            datesitevisit: req.body.datesitevisit,
            timesitevisit: req.body.timesitevisit,
            makefinal: req.body.makefinal
        }

        request.post({
                url: 'https://www.egeotechnical.com/xmphxp/insertservicerequestclient.php',
                form: values
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    res.send(parsedjson.response);

                }

            }) // end request

    })

    app.post('/servicerequest/request/delete', validateinsertrequest, (req, res) => {
        var clientid = req.body.clientid;
        var servicerequest = req.body.servicerequest;
        var values = { clientid, servicerequest }
        request.post({
                url: 'https://www.egeotechnical.com/xmphxp/deleteservicerequestclient.php',
                form: values
            },
            function(err, httpResponse, body) {
                if (!err) {
                    var json = parser.toJson(body);
                    var parsedjson = JSON.parse(json)
                    res.send(parsedjson.response);

                }

            }) // end request

    })



}
