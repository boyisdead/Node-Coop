var Title_name = require('./../models/titlename');
var Acade_pos = require('./../models/acadepos');

var acadePosTypehead = function(res) {
    Acade_pos.find(function(err, acadePos) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                error: err
            })
        return res.status(200).send({
            success: true,
            result: acadePos
        });
    });
}

var titleNameTypehead = function(res) {
    Title_name.find(function(err, titleName) {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Something went wrong while retrieving. try again.",
                error: err
            })
        return res.status(200).send({
            success: true,
            result: titleName
        });
    });
}
module.exports = {
	'acadePosTypehead': acadePosTypehead,
	'titleNameTypehead': titleNameTypehead
}

