   function testUser() {
       console.log('test user')
   }


   function saveUser(myusermodel, myuser) {

       return new Promise((resolve, reject) => {

           const filter = { _id: myuser._id }
           console.log(filter)

           const options = {
               strict: false,
               new: true,
               upsert: true,
               useFindAndModify: false
           }


           myusermodel.findOneAndUpdate(filter, myuser, options, function(err, succ) {
               if (err) {

                   reject(new Error(err))
               }
               else {
                   resolve(succ)
               }
           });


       })

   }

   module.exports = {
       saveUser,
       testUser

   }
   