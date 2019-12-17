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
    origin: ["http://rentmeroom.civilengineer.io", "http://geotechnical.civilengineer.io", "http://pm.civilengineer.io", "http://localhost:3000", "http://petitions.civilengineer.io"]
}



app.all('*', function(req, res, next) {
    let origin = req.headers.origin;
    if (cors.origin.indexOf(origin) >= 0) {

        res.header("Access-Control-Allow-Origin", origin);

    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});
app.use(session({
        secret: 'some string',
        cookie: {
            maxAge: 1000 * 60 * 60 * 30
        }
    }

));

require('./construction')(app);
require('./projectmanagement')(app);
require('./geotechnical')(app);
require('./petitions')(app);
app.get('/', (req, res) => {
    res.send({ response: ` api.civilengineer.io ` })
})

app.listen(process.env.PORT);
