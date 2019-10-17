module.exports = app => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "https://projectmanagement.civilengineer.io");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Credentials", "true")
        next();
    });

    require('./routes/paymentrouter')(app);
    require('./routes/project')(app);
    require('./routes/user')(app);
    require('./routes/authroutes/google')(app);
    require('./routes/authroutes/yahoo')(app);

}
