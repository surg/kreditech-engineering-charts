var async = require('async');
var debug = require('debug')('engineering-charts:data');
var jira = require('./jira_api');
var timeline = require('./timeline')

function platforms(response) {
    var platforms = {};
    for (var i in response) {
        var week = response[i];
        week.issues.forEach(function (issue) {
            var platformName = issue.fields[jira.PLATFORM_FIELD][0].value;
            if (!(platformName in platforms))
                platforms[platformName] = [];
            var platform = platforms[platformName];
            platform[i] = (platform[i] || 0) + 1;

        })
    }
    return Object.keys(platforms).map(function (key) {
        return {
            name: key,
            data: platforms[key]
        };
    });
}

var Data = {
    releasesPerWeekPerPlatform: function (ranges, team, callback) {
        var jqls = ranges.map(function (range) {
            return {
                jql: `project=RELEASE AND resolutiondate > ${range.start}
                       and resolutiondate <= ${range.end} and team = "${team}"`,
                fields: jira.PLATFORM_FIELD
            };
        });
        async.mapSeries(jqls, jira.find, function (err, results) {
            if (err) {
                console.error(err);
                callback(err);
            } else {

                var res = {
                    weeks: timeline.week_labels(ranges),
                    platforms: platforms(results)
                };

                debug("Returning data: " + JSON.stringify(res));
                callback(null, res);
            }
        });
    }
};

module.exports = Data;