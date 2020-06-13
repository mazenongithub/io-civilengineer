module.exports = (req, res, next) => {
    if (req.hasOwnProperty("session")) {

        if (req.session.hasOwnProperty("user")) {

            if (req.session.user.hasOwnProperty("pm")) {
                if(req.session.user.pm = req.params.providerid) {
                     return next();
                } else {
                     res.status(404).send({ message: `Unauthorized User Access ${req.params.providerid} and ${req.session.user.pm} ` })
                }
               
            }
            else {
                res.status(404).send({ message: `There is no user logged in, Please Login to Access Content ` })
            }

        }
        else {
            res.status(404).send({ message: 'There is no user logged in, Please Login to Access Content ' })
        }

    }
    else {
        res.status(404).send({ message: 'There is no user logged in, Please Login to Access Content ' })
    }



}
