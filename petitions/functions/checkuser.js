module.exports = (req, res, next) => {
    if (req.session) {
        if (req.session.petitions) {
            next();
        }
    }
    else {
        res.status(404).send({ message: `Cannot Access, User Not Logged` })
    }

}
