var Title_name = require('./../models/titlename');
var Acade_pos = require('./../models/acadepos');

var acadePosTypeAhead = function(res) {
    Acade_pos.find(function(err, acadePos) {
        if (err)
            res.send(err)
        res.json(acadePos);
    });
}

var titleNameTypeAhead = function(res) {
    Title_name.find(function(err, titleName) {
        if (err)
            res.send(err)
        res.json({success:true,data:titleName});
    });
}
module.exports = {
	'acadePosTypeAhead': acadePosTypeAhead,
	'titleNameTypeAhead': titleNameTypeAhead
}

