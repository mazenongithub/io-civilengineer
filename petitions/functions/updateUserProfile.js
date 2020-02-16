module.exports = (response) => {
    let myuser = response.myuser;
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


                    if (conflict.hasOwnProperty("images")) {
                        if (!conflict.images.image.hasOwnProperty("length")) {
                            let image = [];
                            image.push(conflict.images.image);
                            myuser.petitions.petition[i].conflicts.conflict[j].images.image = image;
                        }
                    }
                    if (conflict.hasOwnProperty("arguements")) {
                        if (!conflict.arguements.arguement.hasOwnProperty("length")) {
                            let arguement = [];
                            arguement.push(conflict.arguements.arguement);
                            myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement = arguement;


                        }
                        conflict.arguements.arguement.map((arguement, k) => {
                            if (arguement.hasOwnProperty("images")) {
                                if (!arguement.images.image.hasOwnProperty("length")) {
                                    let image = [];
                                    image.push(arguement.images.image)
                                    myuser.petitions.petition[i].conflicts.conflict[j].arguements.arguement[k].images.image = image;
                                }
                            }

                        })


                    }
                })

            }

        })

    }

    response.myuser = myuser;
    return response;

}
