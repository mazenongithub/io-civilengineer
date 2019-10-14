module.exports = (response) => {
    if (response.hasOwnProperty("projectteam")) {
        if (response.projectteam.hasOwnProperty("myteam")) {
            if (!response.projectteam.myteam.hasOwnProperty("length")) {
                let myteam = [];
                myteam.push(response.projectteam.myteam);
                response.projectteam.myteam = myteam;
            }
        }


    }
    return response;
}
