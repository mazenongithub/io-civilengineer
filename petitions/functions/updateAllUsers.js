module.exports = (user) => {
    if (user.hasOwnProperty("allusers")) {

        if (!user.allusers.myuser.hasOwnProperty("length")) {
            let myusers = [];
            myusers.push(user.allusers.myuser)
            user.allusers.myuser = myusers;
        }

        // eslint-disable-next-line
        user.allusers.myuser.map((myuser, i) => {

            if (myuser.hasOwnProperty("petitions")) {

                if (!myuser.petitions.petition.hasOwnProperty("length")) {
                    let petition = [];
                    petition.push(myuser.petitions.petition);
                    user.allusers.myuser[i].petitions.petition = petition;
                }

                myuser.petitions.petition.map((petition, j) => {

                    if (petition.hasOwnProperty("conflicts")) {

                        if (!petition.conflicts.conflict.hasOwnProperty("length")) {

                            let conflict = [];
                            conflict.push(petition.conflicts.conflict);
                            user.allusers.myuser[i].petitions.petition[j].conflicts.conflict = conflict;

                        }


                        myuser.petitions.petition[j].conflicts.conflict.map((conflict, k) => {
                            if (conflict.hasOwnProperty("likes")) {
                                if (!conflict.likes.like.hasOwnProperty("length")) {
                                    let like = [];
                                    like.push(conflict.likes.like);
                                    user.allusers.myuser[i].petitions.petition[j].conflicts.conflict[k].likes.like = like;

                                }
                            }

                            if (conflict.hasOwnProperty("comments")) {
                                if (!conflict.comments.comment.hasOwnProperty("length")) {
                                    let comment = [];
                                    comment.push(conflict.comments.comment);
                                    user.allusers.myuser[i].petitions.petition[j].conflicts.conflict[k].comments.comment = comment;
                                }
                            }



                            if (conflict.hasOwnProperty("arguements")) {
                                if (!conflict.arguements.arguement.hasOwnProperty("length")) {
                                    let arguement = [];
                                    arguement.push(conflict.arguements.arguement);
                                    user.allusers.myuser[i].petitions.petition[j].conflicts.conflict[k].arguements.arguement = arguement;


                                }
                                myuser.petitions.petition[j].conflicts.conflict[k].arguements.arguement.map((arguement, l) => {
                                    if (arguement.hasOwnProperty("images")) {

                                        if (!arguement.images.image.hasOwnProperty("length")) {
                                            let image = [];
                                            image.push(arguement.images.image);
                                            user.allusers.myuser[i].petitions.petition[j].conflicts.conflict[k].arguements.arguement[l].images.image = image;

                                        }
                                    }
                                })

                            }
                        })

                    }

                })

            }






        })
    }

    console.log(user)
    return user;

}
