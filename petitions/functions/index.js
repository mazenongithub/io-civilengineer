 const bcrypt = require("bcryptjs")

 function hashPassword(password) {

     return bcrypt.hashSync(password, 10);
 }

 function registerNewUser(myuser, newuser) {

     return new Promise((resolve, reject) => {

         myuser.create(newuser, function(err, succ) {
             if (succ) {

                 resolve(succ)

             }
             else {

                 reject(new Error(`Database Error: Could not Register User ${err}`))


             }
         });



     })
 }


 function getAppleUser(myuser, apple) {


     return new Promise((resolve, reject) => {

         let getuser = false;

         myuser.find({ apple: { $exists: true } }, (err, allusers) => {
             let getuser = false;

             if (!err) {

                 allusers.map(user => {


                     if (bcrypt.compareSync(apple, user.apple)) {

                         getuser = user;

                     }



                 })


                 if (getuser) {
                     resolve(getuser)
                 }

                 else {


                     reject(new Error('Invalid Login'))
                 }


             }
             else {
                 reject(new Error('No Apple Users found'))
             }


         })





     }) // end of promise


 }



 function getGoogleUser(myuser, google) {

     myuser.find({ google: { $exists: true } }, (err, succ) => {

             console.log(succ)
         }


     )


 }


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


     const filter = { _id: myuser._id }
     console.log(filter)

     const options = {
         strict: false,
         new: true,
         upsert: true,
         useFindAndModify: false
     }

     return new Promise((resolve, reject) => {
         myusermodel.findOneAndUpdate(filter, myuser, options, function(err, succ) {
             if (err) {

                 reject(new Error(err))
             }
             else {
                 resolve(succ)
             }
         });

     });



 }

 module.exports = {
     saveUser,
     loadUserProfile,
     hashPassword,
     getAppleUser,
     getGoogleUser,
     registerNewUser

 }
 