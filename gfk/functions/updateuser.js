module.exports = (response) => {
    if (response.hasOwnProperty("images")) {
        if (!response.images.image.hasOwnProperty("length")) {
            let image = [];
            image.push(response.images.image)
            response.images.image = image;
        }
    }
    if (response.hasOwnProperty("fieldreports")) {
        if (!response.fieldreports.fieldreport.hasOwnProperty("length")) {
            let fieldreport = [];
            fieldreport.push(response.fieldreports.fieldreport)
            response.fieldreports.fieldreport = fieldreport;
        }
    }
    return response;

}
