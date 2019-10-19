var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const parser = require('xml2json');
var app = express();
var session = require('express-session')
const keys = require('./keys');
//const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = {
    origin: ["http://pm.civilengineer.io", "http://geotechnical.civilengineer.io"],
    default: "http://pm.civilengineer.io"
}

app.all('*', function(req, res, next) {
    var origin = cors.origin.indexOf(req.header('host').toLowerCase()) > -1 ? req.headers.origin : cors.default;
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(session({
        secret: 'some string',
        cookie: {
            maxAge: 1000 * 60 * 60 * 30
        }
    }

));

require('./projectmanagement')(app);
require('./geotechnical')(app);
app.get('/', (req, res) => {
    res.send({ response: "Hello New App" })
})

app.listen(process.env.PORT);
