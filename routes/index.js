var express = require('express');
var releaseChart = require('../modules/releases');
var router = express.Router();

/* GET home page. */
router.get('/releases/:team/chart.png', function(req, res) {
    releaseChart.plot(req.params.team, function(err, imageStream) {
        if (err) {
            console.error(err.stack);
            res.status(500).send(err);
        } else {
            imageStream.pipe(res);
            res.type('png');
        }
    });

});


module.exports = router;
