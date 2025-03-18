



function JSDateToExcelDate() {

    var returnDateTime = 25569.0 + ((inDate.getTime() - (inDate.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
    console.log(returnDateTime.toString().substr(0,5)); 

}
JSDateToExcelDate(43469.00011574074)