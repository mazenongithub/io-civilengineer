module.exports = (response) => {

    if (response.hasOwnProperty("allusers")) {

        let allusers = response.allusers;
        if (!allusers.myuser.hasOwnProperty("length")) {
            let myusers = [];
            myusers.push(allusers.myuser)
            allusers.myuser = myusers;
        }

        // eslint-disable-next-line
        allusers.myuser.map((myuser, i) => {

            if (myuser.hasOwnProperty("petitions")) {

                if (!myuser.petitions.petition.hasOwnProperty("length")) {
                    let petition = [];
                    petition.push(myuser.petitions.petition);
                    allusers.myuser[i].petitions.petition = petition;
                }

                myuser.petitions.petition.map((petition, j) => {
                    if (petition.hasOwnProperty("likes")) {
                        if (!petition.likes.like.hasOwnProperty("length")) {
                            let like = [];
                            like.push(petition.likes.like)
                            allusers.myuser[i].petitions.petition[j].likes.like = like;
                        }
                    }

                    if (petition.hasOwnProperty("comments")) {
                        if (!petition.comments.comment.hasOwnProperty("length")) {
                            let comment = [];
                            comment.push(petition.comments.comment)
                            allusers.myuser[i].petitions.petition[j].comments.comment = comment;
                        }
                    }

                    if (petition.hasOwnProperty("conflicts")) {

                        if (!petition.conflicts.conflict.hasOwnProperty("length")) {

                            let conflict = [];
                            conflict.push(petition.conflicts.conflict);
                            allusers.myuser[i].petitions.petition[j].conflicts.conflict = conflict;

                        }


                        myuser.petitions.petition[j].conflicts.conflict.map((conflict, k) => {

                            if (conflict.hasOwnProperty("images")) {
                                if (!conflict.images.image.hasOwnProperty("length")) {
                                    let image = [];
                                    image.push(conflict.images.image);
                                    allusers.myuser[i].petitions.petition[j].conflicts.conflict[k].images.image = image;
                                }
                            }

                            if (conflict.hasOwnProperty("arguements")) {
                                if (!conflict.arguements.arguement.hasOwnProperty("length")) {
                                    let arguement = [];
                                    arguement.push(conflict.arguements.arguement);
                                    allusers.myuser[i].petitions.petition[j].conflicts.conflict[k].arguements.arguement = arguement;


                                }

                                conflict.arguements.arguement.map((arguement, l) => {
                                    if (arguement.hasOwnProperty("images")) {
                                        if (!arguement.images.image.hasOwnProperty("length")) {
                                            let image = [];
                                            image.push(arguement.images.image)
                                            allusers.myuser[i].petitions.petition[j].conflicts.conflict[k].arguements.arguement[l].images.image = image;
                                        }
                                    }

                                })


                            }
                        })

                    }

                })

            }



        })
        response.allusers = allusers;
    }


    return response;;

}
