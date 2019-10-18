const keys = require('./keys')
module.exports = app => {


    require('./routes/paymentrouter')(app);
    require('./routes/project')(app);
    require('./routes/user')(app);
    require('./routes/authroutes/google')(app);
    require('./routes/authroutes/yahoo')(app);

}
