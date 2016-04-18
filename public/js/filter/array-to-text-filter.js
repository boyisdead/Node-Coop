mainModule.filter('arrayToText', function() {
    return function(input) {
    	var r = '';
    	var s;
    	for (var i = 0 ; i < input.length; i++){
    		s = input[i]; 
    		s = (typeof s!="undefined") ? s.charAt(0).toUpperCase() + s.substr(1).toLowerCase() : '';
    		r = r + s;
    		if (i < input.length-1) r = r  + ", ";
    	}
        return r;
    }
})
