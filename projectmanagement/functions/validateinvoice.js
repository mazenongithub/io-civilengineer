const keys = require('../keys');
const request = require("request");
module.exports = (req, res, next) => {
    const invoiceid = req.body.invoiceid;
    const providerid = req.session.user.pm;
    request({
            url: `https://civilengineer.io/projectmanagement/api/validateinvoiceid.php?invoiceid=${invoiceid}&providerid=${providerid}`,
            headers: {
                'Content-Type': 'application/json',
                'Permission': `${keys.grantAuthorization}`
            }
        },
        function(err, httpResponse, body) {
            if (!err) {

                const response = JSON.parse(body);

                if (response.validate) {
                    next();
                }
                else if (response.message) {
                    res.status(404).send({ message: `${response.message} transaction failed ` });

                }
                else {

                    res.status(404).send({ message: `Invalid matching parameters for invoiceid ${invoiceid} and providerid ${providerid}` });
                }

            }
            else {
                res.status(404).send({ message: `Could not validate invoice` });
            }


            //values returned from DB


        }) // end request

}
