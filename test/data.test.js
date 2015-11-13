var expect = require('chai').expect;
var debug = require('debug')('engineering-charts:data.test');
var proxyquire = require('proxyquire');
var data = proxyquire('../modules/data.js', {'./jira_api': require('./jira_api.mock.js')});

describe('Data', function() {
    it('happy-flow', function (done) {
        var ranges = [
            { start: '2015-11-02', end: '2015-11-09', week: 45 },
            { start: '2015-10-26', end: '2015-11-02', week: 44 },
        ];

        data.releasesPerWeekPerPlatform(ranges, '', function (err, results) {
            expect(results).to.be.not.empty;
            expect(results).to.be.deep.equal({
                "platforms": [
                    {
                        "data": [6, 2],
                        "name": "Kredito24/Zaimo_old"
                    },
                    {
                        "data": [2, 3],
                        "name": "LPA"
                    }
                ],
                "weeks": ["CW45", "CW44"]
            });
            debug(results);
            done();
        });
    });
});