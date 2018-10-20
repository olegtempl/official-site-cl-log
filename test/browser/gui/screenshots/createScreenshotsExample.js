const Pageres = require('pageres'),
      cl = require('node-cl-log'),
      path = require('../../../configs/path.json');

const pageres = new Pageres({delay: 2})
	.src('yeoman.io', ['480x320', '1024x768', 'iphone 5s'], {crop: true})
	.src('todomvc.com', ['1280x1024', '1920x1080'])
	.src('data:text/html;base64,PGgxPkZPTzwvaDE+', ['1024x768'])
	.dest(path.docs.scrennshotesWebSite)
	.run()
	.then(() => {
    cl.gre('Create sreenshotes done');
  });

module.exports = pageres;
