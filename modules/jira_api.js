var unirest = require('unirest');
var debug = require('debug')('engineering-charts:jira_api');
var nconf = require('nconf');
var async = require('async');

function jira_config(callback) {
    nconf.get('jira', function (err, result) {
        callback(err, result);
    });
}

function jira_call(query) {
    return function (creds, callback) {
        debug(`Looking for issue with query: ${query.jql}`);
        unirest.get('https://kredito.atlassian.net/rest/api/2/search')
            .header('Accept', 'application/json')
            .auth(creds.user, creds.password)
            .query(query)
            .end(function (response) {
                if (response.code != 200) {
                    debug(`Error: response code: ${response.code}`);
                    return callback(response.body.errorMessages);
                }
                debug('Response: ' + response.body);
                callback(null, response.body)
            });
    }

}

var JiraAPI = {
    PLATFORM_FIELD: 'customfield_12600',
    find: function (query, callback) {
        async.waterfall([jira_config, jira_call(query)], callback);
    }
};

module.exports = JiraAPI;
