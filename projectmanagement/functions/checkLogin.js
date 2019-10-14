module.exports = (req, res, next) => {
    let providerid = req.params.providerid;
    if (providerid === "rickjones" || providerid === "stevenatwater") {
        return next();
    }
    else {

        if (req.session.hasOwnProperty("user")) {
            if (req.session.user.hasOwnProperty("providerid")) {
                if (req.session.user.providerid === req.params.providerid) {
                    return next();
                }
                else {
                    console.log("14", "MIDDLEWARE REJJECTION")
                    return res.send({ errorMessage: `You do not have permission to access this resource ${req.params.providerid} ` });
                }
            }
            else {

                return res.send({ errorMessage: ' You must be logged in to access this location ' });
            }
        }
        else {
            return res.send({ errorMessage: ' You must be logged in to access this location ' });
        }




    }


}
