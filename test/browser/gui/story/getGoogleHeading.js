const webdriverio = require('webdriverio');
let options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
const result =
webdriverio
    .remote(options)
    .init()
    .url('http://www.google.com')
    .getTitle().then(function(title) {
        console.log('Title was: ' + title);
    })
    .end()
    .catch(function(err) {
        console.log(err);
    });

module.exports =  result;
