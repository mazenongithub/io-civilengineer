module.exports = (req, res, next) => {
    if (req.hasOwnProperty("session")) {

        if (req.session.hasOwnProperty("construction")) {
            return next();
        }
        else {
            res.status(404).send({ message: `Please login to access profile content construction  ` })
        }

    }
    else {
        res.status(404).send({ message: 'Please login to access profile content session not found ' })
    }



}
