module.exports = (response) => {

    if (response.hasOwnProperty("allusers")) {
        if (response.allusers.hasOwnProperty("myuser")) {
            if (!response.allusers.myuser.hasOwnProperty("length")) {
                let myuser = [];
                myuser.push(response.allusers.myuser);
                response.allusers.myuser = myuser;
            }
        }
    }
    return response;
}
