var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const parser = require('xml2json');
const cors = require('cors')
var app = express();
var session = require('express-session')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
const keys = require('./keys');
app.use(session({ secret: 'some string', cookie: { maxAge: 1000 * 60 * 60 * 30 } }));
require('./projectmanagement')(app);
require('./geotechnical')(app);
app.get('/', (req, res) => {
    res.send({ response: "Hello New App" })
})

app.listen(process.env.PORT);
