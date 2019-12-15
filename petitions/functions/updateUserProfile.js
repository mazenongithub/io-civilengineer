module.exports = (myuser) => {

    if (myuser.hasOwnProperty("petitions")) {

        if (!myuser.petitions.petition.hasOwnProperty("length")) {
            let petition = [];
            petition.push(myuser.petitions.petition);
            myuser.petitions.petition = petition;
        }

        myuser.petitions.petition.map((petition, i) => {

            if (petition.hasOwnProperty("conflicts")) {

                if (!petition.conflicts.conflict.hasOwnProperty("length")) {

                    let conflict = [];
                    conflict.push(petition.conflicts.conflict);
                    myuser.petitions.petition[i].conflicts.conflict = conflict;

                }


                myuser.petitions.petition[i].conflicts.conflict.map((conflict, j) => {
                    if (conflict.hasOwnProperty("likes")) {
                        if (!conflict.likes.like.hasOwnProperty("length")) {
                            let like = [];
                            like.push(conflict.likes.like);
                            myuser.petitions.petition[i].conflicts.conflict[j].likes.like = like;

                        }
                    }

                    if (conflict.hasOwnProperty("comments")) {
                        if (!conflict.comments.comment.hasOwnProperty("length")) {
                            let comment = [];
                            comment.push(conflict.comments.comment);
                            myuser.petitions.petition[i].conflicts.conflict[j].comments.comment = comment;
                        }
                    }



                    if (conflict.hasOwnProperty("arguements")) {
                        if (!conflict.arguements.arguement.hasOwnProperty("length")) {
                            let arguement = [];
                            arguement.push(conflict.arguements.arguement);
                            myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement = arguement;


                        }
                        myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement.map((arguement, k) => {
                            if (arguement.hasOwnProperty("images")) {

                                if (!arguement.images.image.hasOwnProperty("length")) {
                                    let image = [];
                                    image.push(arguement.images.image);
                                    myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement[k].images.image = image;

                                }
                            }
                        })

                    }
                })

            }

        })

    }

    return myuser;

}
