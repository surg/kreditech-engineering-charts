var expect = require('chai').expect;
var jira_api = require('../modules/jira_api.js');
var debug = require('debug')('engineering-charts:jira_api.test');
require('../modules/nconf');

describe.skip('JIRA API test', function(){
    it('test fields', function(done) {
        jira_api.find({jql: 'key=RELEASE-540', fields: jira_api.PLATFORM_FIELD}, function(error, results) {
            debug(results);
            expect(results.issues.length).to.be.equal(1);
            expect(Object.keys(results.issues[0].fields)).to.be.deep.equal([jira_api.PLATFORM_FIELD]);
            done()
        });
    });
});