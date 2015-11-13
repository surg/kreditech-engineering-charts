var nconf = require('nconf');
var debug = require('debug')('engineering-charts:charts');

var plotly = require('plotly');

function cumulate(seriesY) {
    var base = [];
    for (var i = 0; i < seriesY.length; i++) {
        var ser = seriesY[i].data;
        for (var j = 0; j < ser.length; j++) {
            ser[j] = (ser[j] + (base[j] || 0)) || 0;
            base[j] = ser[j];
        }
    }
    return seriesY;
}

var Charts = {
    plotCumulative: function (x, series, callback) {
        var traces = cumulate(series).map(function (y) {
            return {
                x: x,
                y: y.data,
                name: y.name,
                fill: "tonexty",
                type: "scatter"
            }
        });

        var figure = {'data': traces};

        var imgOpts = {format: 'png', width: 1000, height: 500};

        nconf.get('plotly', function (err, value) {
            if (err) return callback(err);
            debug('Plotly user: ' + value.user);
            plotly(value.user, value.key).getImage(figure, imgOpts, callback);
        });
    }
};

module.exports = Charts;