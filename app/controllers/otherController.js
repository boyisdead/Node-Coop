var Title_name = require('./../models/titlename');
var Acade_pos = require('./../models/acadepos');

var acadePosTypeAhead = function(res) {
    Acade_pos.find(function(err, acadePos) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        return res.status(500).send({
            success: true,
            result: acadePos
        });
    });
}

var titleNameTypeAhead = function(res) {
    Title_name.find(function(err, titleName) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again."
            })
        return res.status(500).send({
            success: true,
            result: titleName
        });
    });
}
module.exports = {
	'acadePosTypeAhead': acadePosTypeAhead,
	'titleNameTypeAhead': titleNameTypeAhead
}

