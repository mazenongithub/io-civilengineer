module.exports = (myuser, conflictid) => {
    let keys = [];
    if (myuser.hasOwnProperty("petitions")) {
        // eslint-disable-next-line
        myuser.petitions.petition.map((petition, i) => {
            if (petition.hasOwnProperty("conflicts")) {
                // eslint-disable-next-line
                petition.conflicts.conflict.map((conflict, j) => {
                if (conflict.conflictid === conflictid) {
                    keys[0] = i;
                    keys[1] = j;
                }


                    
                })
            }



        })

    } // get the image key


    return keys;
}
