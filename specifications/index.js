const mongoose = require("mongoose");
const checkUserLogin = require('../construction/functions/checkuserlogin');
const checkUser = require('../design/functions/checkuser');
const checkLogin = require('../projectmanagement/functions/checklogin');
const keys = require('./keys')
module.exports = app => {

    mongoose.connect(`${keys.SPECIFICATIONS}`, { useNewUrlParser: true },
        (err) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log('connection successfully')
            }

        }
    )

    const Schema = new mongoose.Schema({
            companyid: String,
            projectid: String,
            specifications: [{
                csiid: String,
                paragraph: {
                    listType: String,
                    list: [{
                            contentid: String,
                            content: String,
                            sublist: {
                                listType: String,
                                list: [{
                                    contentid: String,
                                    content: String,

                                }]
                            }

                        }

                    ]

                }

            }]


        }, { strict: false }


    );

    app.get('/projectmanagement/:projectid/specifications', checkLogin, (req, res) => {

        const specifications = mongoose.model("specifications", Schema);
        const projectid = req.params.projectid;
        const filter = { projectid }
        specifications.find(filter, (err, succ) => {

            if (err) {
                console.log(err)
            }
            else {

                let response = {}
                if (succ) {
                    response = succ;
                }
                res.send(response)
            }

        })

    })

    app.get('/construction/:projectid/specifications', (req, res) => {

        const specifications = mongoose.model("specifications", Schema);
        const projectid = req.params.projectid;
        const filter = { projectid }
        specifications.find(filter, (err, succ) => {

            if (err) {
                console.log(err)
            }
            else {

                let response = {}
                if (succ) {
                    response = succ;
                }
                res.send(response)
            }

        })

    })



    app.get('/construction/:projectid/specifications', checkUserLogin, (req, res) => {

        const specifications = mongoose.model("specifications", Schema);
        const projectid = req.params.projectid;
        const filter = { projectid }
        specifications.find(filter, (err, succ) => {

            if (err) {
                console.log(err)
            }
            else {

                let response = {}
                if (succ) {
                    response = succ;
                }
                res.send(response)
            }

        })

    })

    app.get('/design/:companyid/specifications/:projectid', checkUser, (req, res) => {

        const specifications = mongoose.model("specifications", Schema);
        const companyid = req.params.companyid;
        const projectid = req.params.projectid;
        const filter = { companyid, projectid }
        specifications.findOne(filter, (err, succ) => {

            if (err) {
                console.log(err)
                res.status(404).send({ message: ' Specification Request Failed ' })
            }
            else {
                if (!succ) {
                    res.send({})
                }
                else {
                    res.send(succ)
                }

            }

        })

    })



    app.post('/design/:projectid/saveprojectspecs', checkUser, (req, res) => {
        const specifications = mongoose.model("specifications", Schema);
        const projectid = req.params.projectid;
        const specs = req.body.specs;

        const filter = { projectid, companyid: specs.companyid }

        const options = {

            strict: false,
            new: true,
            upsert: true,
            useFindAndModify: false


        }
        specifications.findOneAndUpdate(filter, specs, options, function(err, succ) {
            if (err) {

                console.log(err);
            }
            else {
                res.send(succ);
            }
        });

    });



}
