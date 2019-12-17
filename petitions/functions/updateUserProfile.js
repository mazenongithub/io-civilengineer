module.exports = (myuser) => {

    if (myuser.hasOwnProperty("petitions")) {

        if (!myuser.petitions.petition.hasOwnProperty("length")) {
            let petition = [];
            petition.push(myuser.petitions.petition);
            myuser.petitions.petition = petition;
        }

        myuser.petitions.petition.map((petition, i) => {
            if (petition.hasOwnProperty("likes")) {
                if (!petition.likes.like.hasOwnProperty("length")) {
                    let like = [];
                    like.push(petition.likes.like)
                    myuser.petitions.petition[i].likes.like = like;
                }
            }
            if (petition.hasOwnProperty("comments")) {
                if (!petition.comments.comment.hasOwnProperty("length")) {
                    let comment = [];
                    comment.push(petition.comments.comment)
                    myuser.petitions.petition[i].comments.comment = comment;
                }
            }

            if (petition.hasOwnProperty("conflicts")) {

                if (!petition.conflicts.conflict.hasOwnProperty("length")) {

                    let conflict = [];
                    conflict.push(petition.conflicts.conflict);
                    myuser.petitions.petition[i].conflicts.conflict = conflict;

                }


                myuser.petitions.petition[i].conflicts.conflict.map((conflict, j) => {



                    if (conflict.hasOwnProperty("arguements")) {
                        if (!conflict.arguements.arguement.hasOwnProperty("length")) {
                            let arguement = [];
                            arguement.push(conflict.arguements.arguement);
                            myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement = arguement;


                        }


                    }
                })

            }

        })

    }

    return myuser;

}
