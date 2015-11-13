var moment = require('moment');
var DATE_FORMAT = 'YYYY-MM-DD';

var Timeline = {
    weeks: function (params) {
        params = params || {};
        var count = params.count || 5;
        var now = params.now || moment();
        return Array.apply(0, new Array(count)).map(function (e, i) {

            var baseDate = now.subtract(i, 'Week');
            return {
                start: moment(baseDate).weekday(1).format(DATE_FORMAT),
                end: moment(baseDate).weekday(7).format(DATE_FORMAT),
                week: moment(baseDate).week()
            };
        }).reverse();
    },

    week_labels: function(ranges) {
        return ranges.map(function(range) {
            return 'CW' + range.week;
        });
    }


};

module.exports = Timeline;
