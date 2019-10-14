module.exports = (req, res, next) => {

    if (!req.body.projectid) {
        var error = { errorMessage: 'You have to enter a Project ID to Enter an Event' }
        error = JSON.stringify(error)
        return res.status(409).send({ error });
    }
    else if (Number(req.body.projectid) === 0) {
        var error = { errorMessage: 'You have to enter a Project ID to Enter an Event' }
        error = JSON.stringify(error)
        return res.status(409).send({ error });
    }

    next();
};
