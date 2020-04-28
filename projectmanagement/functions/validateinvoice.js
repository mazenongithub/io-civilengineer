const keys = require('../keys');
const request = require("request");
module.exports = (req, res, next) => {
    const invoiceid = req.params.invoiceid;
    const providerid = req.params.providerid;

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
                console.log("validateinvoice", response)
                if (response.validate) {
                    next();
                }
                else {
                    res.status(404).send(`Invalid matching parameters for invoiceid ${invoiceid} and providerid ${providerid}`);
                }

            }
            else {
                res.status(404).send(`Could not validate invoice`);
            }


            //values returned from DB


        }) // end request

}
