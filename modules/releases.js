var charts = require('./charts');
var data = require('./data');
var timeline = require('./timeline.js');

var Releases = {
    plot: function(team, callback)  {
        data.releasesPerWeekPerPlatform(timeline.weeks(), team, function(err, releases) {
            if (err) return callback(err);
            charts.plotCumulative(releases.weeks, releases.platforms, callback);
        });
    }
};

module.exports = Releases;