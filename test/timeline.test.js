var expect = require('chai').expect;
var moment = require('moment');
var timeline = require(process.cwd() + '/modules/timeline.js');

describe("Timeline Test", function() {
    it("Default count is 5", function() {
        var weeks = timeline.weeks();
        expect(weeks.length).to.be.equal(5);
    });

    it('Count parameter is considered', function() {
        var count = 10;
        var weeks = timeline.weeks({count: count});
        expect(weeks.length).to.be.equal(count);
    });

    it('Weeks are correct', function() {
        var weeks = timeline.weeks({count: 2, now: moment('2015-11-13')});
        expect(weeks).to.be.deep.equal([
            {
                "end": "2015-11-08",
                "start": "2015-11-02",
                "week": 45
            },
            {
                "end": "2015-11-15",
                "start": "2015-11-09",
                "week": 46
            }
        ]);
    });

    it('Week labels', function() {
        var weeks = timeline.weeks({count: 2, now: moment('2015-11-13')});
        var labels = timeline.week_labels(weeks);
        expect(labels).to.be.deep.equal(['CW45', 'CW46']);
    });
});