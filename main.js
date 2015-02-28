Router.route('/', function() {
  this.render('main');
});

Router.route('/ideas', function() {
  this.render('ideas');
});

Router.route('/projects',function() {
  this.render('projects');
});

