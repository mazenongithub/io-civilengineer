module.exports = (req, res, next) => {
    if (req.hasOwnProperty("session")) {

        if (req.session.hasOwnProperty("user")) {

            if (req.session.user.hasOwnProperty("construction")) {
                return next();
            }
            else {
                res.send({ message: 'You should be logged in to access this location, no user is logged into construction ' })
            }

        }
        else {
            res.send({ message: 'You should be logged in to access this location, no user exists ' })
        }

    }
    else {
        res.send({ message: 'You should be logged in to access this location, no session exists ' })
    }



}
