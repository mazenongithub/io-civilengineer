const keys = require('./keys')
module.exports = app => {
    //app.use(function(req, res, next) {
    //    res.header("Access-Control-Allow-Origin", keys.clientAPI);
    //    res.header("Access-Control-Allow-Credentials", "true")
    //    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //    next();
    //});

    require('./routes/paymentrouter')(app);
    require('./routes/project')(app);
    require('./routes/user')(app);
    require('./routes/authroutes/google')(app);
    require('./routes/authroutes/yahoo')(app);

}
