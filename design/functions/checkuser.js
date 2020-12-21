module.exports = (req, res, next) => {
    if (req.hasOwnProperty("session")) {



        if (req.session.hasOwnProperty("design")) {
            return next();
        }
        else {
            res.status(404).send({ message: `Please login to access profile content design  ` })
        }



    }
    else {
        res.status(404).send({ message: 'Please login to access profile content session not found ' })
    }



}
