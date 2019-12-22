module.exports = (myuser, arguementid) => {
    let keys = [];
    if (myuser.hasOwnProperty("petitions")) {
        // eslint-disable-next-line
        myuser.petitions.petition.map((petition, i) => {
            if (petition.hasOwnProperty("conflicts")) {
                // eslint-disable-next-line
                petition.conflicts.conflict.map((conflict, j) => {


                    if (conflict.hasOwnProperty("arguements")) {
                        // eslint-disable-next-line
                        conflict.arguements.arguement.map((arguement, k) => {
                           if(arguement.arguementid === arguementid) {
                               keys[0] = i;
                               keys[1] = j;
                               keys[2] = k;
                           }
                            
                        })
                    }
                })
            }



        })

    } // get the image key


    return keys;
}
