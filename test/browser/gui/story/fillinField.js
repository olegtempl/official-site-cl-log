/*
  TODO:
    * add fill form fields with bad-data-generator
*/

const badGen = require('bad-data-generator');

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
    // .setValue(badGen.name)
    .end()
    .catch(function(err) {
        console.log(err);
    });

module.exports =  result;
