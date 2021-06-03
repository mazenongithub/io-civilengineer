function loadUserProfile(myusermodel, _id) {

    return new Promise((resolve, reject) => {

        myusermodel.findById({ _id }, function(err, succ) {
            if (succ) {

                resolve(succ)

            }
            else if (err) {

                reject(new Error(`User Not Found ${err}`))
            }

        })

    })

}

function saveUser(myusermodel, myuser) {

    return new Promise((resolve, reject) => {
        myusermodel.create(myuser, function(err, succ) {
            if (succ) {

                resolve(succ)

            }
            else {

                reject(new Error(`Database Error: Could not Register User ${err}`))


            }
        });

        // const filter = { _id: myuser._id }
        // console.log(filter)

        // const options = {
        //     strict: false,
        //     new: true,
        //     upsert: true,
        //     useFindAndModify: false
        // }


        // myusermodel.findOneAndUpdate(filter, myuser, options, function(err, succ) {
        //     if (err) {

        //         reject(new Error(err))
        //     }
        //     else {
        //         resolve(succ)
        //     }
        // });


    })

}

module.exports = {
    saveUser

}
