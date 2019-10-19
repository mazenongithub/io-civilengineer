var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const parser = require('xml2json');
var app = express();
var session = require('express-session')
const keys = require('./keys');
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const whitelist = ['http://pm.civilengineer.io', 'http://geotechnical.civilengineer.io']
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        }
        else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))
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
