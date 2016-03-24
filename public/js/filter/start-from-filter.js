mainModule.filter('startFrom', function() {
    return function(data, start,end) {
    	if(!data || !data.length)
    		return;
        return data.slice(start,start+end);
    }
})
