module.exports = app => {
    const mongoose = require("mongoose");
    mongoose.connect('mongodb://mazenonmlab:100%25Original@ds113749.mlab.com:13749/specifications', { useNewUrlParser: true },
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

            }]


        }, { strict: false }


    );
    const specifications = mongoose.model("specifications", Schema);

    app.get('/design/:companyid/specifications/:projectid', (req, res) => {
        const companyid = req.params.companyid;
        const projectid = req.params.projectid;
        const filter = { companyid, projectid }
        specifications.findOne(filter, (err, succ) => {

            if (err) {
                console.log(err)
            }
            else {
                res.send(succ)
            }

        })

    })

    app.post('/design/:projectid/saveprojectspecs', function(req, res) {
        const projectid = req.params.projectid;
        const specs = req.body.specs;
        console.log(specs)
        const filter = { projectid, companyid: specs.companyid }
        console.log(filter)
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

//var restfulSchema = new mongoose.Schema({ firstname: String, lastname: String });
//RestFul - 1 - Index Load all values
//var people = mongoose.model("people", restfulSchema);
