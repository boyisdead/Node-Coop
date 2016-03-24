
var getFileExtension = function(filename){
    return '.' + filename.substr(filename.lastIndexOf('.') + 1);
}

var numToLengthString = function(num, length){
    var newNum = "" + num.toString();
    while(newNum.length<length){
        newNum = "0" + newNum;
    }
    return newNum;
}

var autoPrefixId = function(prefix, max, numLong){
    var new_id = prefix.concat(numToLengthString(max,numLong));
    console.log(new_id);
    return new_id;
};

module.exports = {
	'getFileExtension': getFileExtension,
	'numToLengthString': numToLengthString,
	'autoPrefixId': autoPrefixId
}