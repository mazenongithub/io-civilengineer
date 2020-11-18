var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const parser = require('xml2json');
var app = express();
var session = require('express-session')
const keys = require('./keys');
const multer = require("multer");
const mongoose = require("mongoose")

//const cors = require('cors')

mongoose.connect(`${keys.MONGODB}`, { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log(err)
        }

    }
)



const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.use(multer({ fileFilter }).single('profilephoto'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}));


const cors = {
    origin: [
        "http://design.civilengineer.io",
        "http://pm.civilengineer.io",
        "http://localhost:3000",
        "http://petitions.civilengineer.io",
        "http://construction.civilengineer.io"
    ]
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
            maxAge: 1000 * 60 * 60 * 30,
            sameSite: 'none',
            secure: keys.secure
        }
    }

));
app.set('trust proxy', 1);


require('./construction')(app)
require('./projectmanagement')(app)
require('./design')(app)
require('./specifications')(app)
require('./appbaseddriver')(app)

app.get('/', (req, res) => {
    let response = { response: ` api.civilengineer.io ` }
    res.send(response)
})




app.listen(process.env.PORT);
