const cl = require('node-cl-log');

// const takeSreenshots = require('./screenshots/createScreenshotsExample');
const makeSreenshotsMainPage = require('./screenshots/screenMainPage');
const makeSreenshotsAboutPage = require('./screenshots/screenAboutPage');
const makeSreenshotsContactsPage = require('./screenshots/screenContactsPage');


cl.log('Start create the screenshot site!');

// takeSreenshots


// Make screenshots only for these pages

/*
  Before you start creating screenshots for these pages, you must run commands,
  When you execute the command, go to the new tab of your console:
  xfce4-terminal --tab
  xfce4-terminal --tab
  xfce4-terminal --tab
  gulp browser-sync
  gulp selenium
  node test/gui/spec_screenshots.js
*/
makeSreenshotsMainPage
makeSreenshotsAboutPage
makeSreenshotsContactsPage

cl.gre('End create the screenshot site!');
