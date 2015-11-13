var fs = require('fs');
var json = JSON.parse(fs.readFileSync(process.cwd() + '/test/data.test.json', 'utf8'));
var callcount = 0;

var JiraAPI = {
    find: function (query, callback) {
        callback(null, json[callcount % json.length]);
        callcount++;
    }
};

module.exports = JiraAPI;
