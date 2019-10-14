module.exports = app => {
    require('./routes/authroutes')(app);
    require('./routes/budgetroutes')(app);
    require('./routes/balanceroutes')(app);
    require('./routes/google')(app);
    require('./routes/yahoo')(app);

}
