module.exports = (response) => {

    if (response.hasOwnProperty("allmyproviders")) {
        if (!response.allmyproviders.hasOwnProperty("length")) {
            let myprovider = [];
            myprovider.push(response.allmyproviders.myprovider);
            response.allmyproviders.myprovider = myprovider;
        }
    }
    //end updateproject

    if (response.hasOwnProperty("searchproviders")) {
        if (!response.searchproviders.myprovider.hasOwnProperty("length")) {
            let searchprovider = [];
            searchprovider.push(response.searchproviders.myprovider);
            response.searchproviders.myprovider = searchprovider;
        }
    }
    return response;
}
