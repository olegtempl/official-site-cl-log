const psi = require('psi'),
      cl = require('node-cl-log');


// URL for your site
const testUrlSite = '';

// Get the PageSpeed Insights report
psi(testUrlSite).then(data => {
  cl.log(data.ruleGroups.SPEED.score);
  cl.log(data.pageStats);
});

// Output a formatted report to the terminal
psi.output(testUrlSite).then(() => {
  cl.log('done');
});

// Supply options to PSI and get back speed and usability scores
psi(testUrlSite, {
  nokey: 'true',
  strategy: 'mobile'}).then(data => {
    cl.log(`Speed score: ${data.ruleGroups.SPEED.score}`);
    cl.log(`Usability score: ${data.ruleGroups.USABILITY.score}`);
});
