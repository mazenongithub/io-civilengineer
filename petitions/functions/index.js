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

 function getPetitionByID(myusermodel, petitionid) {

  let obj = {}

  return new Promise((resolve, reject) => {

   myusermodel.find({ petitions: { $exists: true } }, (err, succ) => {

    if (succ) {



     succ.map(myuser => {

      if (myuser.petitions) {

       myuser.petitions.map(petition => {
        if (petition.url === petitionid) {

         obj = { firstname: myuser.firstname, lastname: myuser.lastname, emailaddress: myuser.emailaddress, userid: myuser.userid, petition }


        }


       })

      }




     })

     resolve(obj)

    }
    else if (err) {

     reject(new Error(err))
    }


   })


  })



 }


 function getAllPetitions(myusermodel) {

  let petitions = [];

  return new Promise((resolve, reject) => {

   myusermodel.find({ petitions: { $exists: true } }, (err, succ) => {

    if (succ) {



     succ.map(myuser => {

      if (myuser.petitions) {

       myuser.petitions.map(petition => {

        let obj = { firstname: myuser.firstname, lastname: myuser.lastname, emailaddress: myuser.emailaddress, userid: myuser.userid, petition }
        petitions.push(obj)


       })

      }




     })

     resolve(petitions)

    }
    else if (err) {

     reject(new Error(err))
    }


   })


  })

 }



 function saveUser(myusermodel, myuser) {


  const filter = { _id: myuser._id }


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
  registerNewUser,
  getAllPetitions,
  getPetitionByID

 }
 