const keys = require('./keys')
module.exports = app => {

    //app.use(function(req, res, next) {
    //    res.header("Access-Control-Allow-Origin", keys.clientAPI);
    //    res.header("Access-Control-Allow-Credentials", "true")
    //    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //    next();
    //});
    require('./routes/authroutes')(app);
    require('./routes/budgetroutes')(app);
    require('./routes/balanceroutes')(app);
    require('./routes/google')(app);
    require('./routes/yahoo')(app);

}
