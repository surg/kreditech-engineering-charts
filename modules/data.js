var async = require('async');
var debug = require('debug')('engineering-charts:data');
var jira = require('./jira_api');
var timeline = require('./timeline');
var cache = require('memory-cache');

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

function fetchData(query, callback) {
    function fromMemory(callback) {
        if (!query.lastWeek)
            return callback(null, cache.get(query.jql));
        return callback(null, null); // indication we need to fetch from the next source
    }

    function fromJira(prevResult, callback) {
        if (prevResult) {
            debug('Found previously saved data. Skipping jira call. Query: ' + query.jql);
            return callback(null, prevResult); // just pass on
        }
        jira.find(query, function(err, result) {
            if (!err) {
                cache.put(query.jql, result);
            }
            callback(err, result);
        });
    }

    async.waterfall([fromMemory, fromJira], callback);
}

var Data = {
    releasesPerWeekPerPlatform: function (ranges, team, callback) {
        var jqls = ranges.map(function (range) {
            return {
                jql: `project=RELEASE AND resolutiondate > ${range.start}
                       and resolutiondate <= ${range.end} and team = "${team}"`,
                fields: jira.PLATFORM_FIELD,
                lastWeek: range.week == timeline.currentWeek()
            };
        });
        async.mapSeries(jqls, fetchData, function (err, results) {
            if (err) {
                console.error(err);
                callback(err);
            } else {

                var res = {
                    weeks: timeline.weekLabels(ranges),
                    platforms: platforms(results)
                };

                debug("Returning data: " + JSON.stringify(res));
                callback(null, res);
            }
        });
    }
};

module.exports = Data;