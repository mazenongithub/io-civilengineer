module.exports = (myuser, imageid) => {
    let keys = [];
    if (myuser.hasOwnProperty("petitions")) {
        // eslint-disable-next-line
        myuser.petitions.petition.map((petition, i) => {
            if (petition.hasOwnProperty("conflicts")) {
                // eslint-disable-next-line
                petition.conflicts.conflict.map((conflict, j) => {

                    if (conflict.hasOwnProperty("images")) {
                        // eslint-disable-next-line
                        conflict.images.image.map((image, k) => {
                            if (image.imageid === imageid) {
                                keys[0] = i;
                                keys[1] = j;
                                keys[2] = k;
                            }
                        })
                    }

                    if (conflict.hasOwnProperty("arguements")) {
                        // eslint-disable-next-line
                        conflict.arguements.arguement.map((arguement, k) => {
                            if (arguement.hasOwnProperty("images")) {
                                // eslint-disable-next-line
                                arguement.images.image.map((image, l) => {
                                    if (image.imageid === imageid) {
                                        keys[0] = i;
                                        keys[1] = j;
                                        keys[2] = k;
                                        keys[3] = l;
                                    }
                                })
                            }
                        })
                    }
                })
            }



        })

    } // get the image key


    return keys;
}
