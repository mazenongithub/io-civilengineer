 module.exports = (response) => {
     if (response.hasOwnProperty("myletter")) {

         if (response.myletter.hasOwnProperty("letterbody")) {

             if (response.myletter.letterbody.hasOwnProperty("lettercontent")) {

                 if (!response.myletter.letterbody.lettercontent.hasOwnProperty("length")) {

                     let mycontent = [];
                     mycontent.push(response.myletter.letterbody.lettercontent)
                     response.myletter.letterbody.lettercontent = mycontent;
                 }
             }

         }
     }
     return response;
 }
 