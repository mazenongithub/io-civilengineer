module.exports = (req, res, next) => {
    
    if (req.hasOwnProperty("session")) {

        if (req.session.hasOwnProperty("appbaseddriver")) {
            return next();
        }
        else {
            res.status(404).send({ message: `You have to Login to Access AppBasedDriver   ` })
        }

    }
    else {
        res.status(404).send({ message: 'You have to Login to Access AppBasedDriver ' })
    }



}
