Router.onBeforeAction(function () {
  window.scrollTo(0,0);
  this.next();
});

Router.configure({
 notFoundTemplate: 'pageNotFound',
 loadingTemplate: 'loading', 
 waitOn: function () {
  return [
  Meteor.subscribe('ideasList'),
  Meteor.subscribe('projectsList'),
  Meteor.subscribe('commentsList'),
  Meteor.subscribe('tagsList'),
  Meteor.subscribe('usersList')
  ];
}
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/ideas', function () {
  this.render('ideasTab');
  document.title = "Spark | Ideas";
});

Router.route('/projects',function () {
  this.render('projectsTab');
  document.title = "Spark | Projects"
});

Router.route('/newidea', function () {
  this.render('newIdea');
});

Router.route('/newproject', function () {
  this.render('newProject');
});

Router.route('/ideas/:slug', function () {
  this.render('loading');
  if (Ideas.findOne({slug: this.params.slug})) {
    this.render('ideaView', {
      data: function () {
        return Ideas.findOne({slug: this.params.slug});
      }
    });
  }
});

Router.route('/projects/:slug', function () {
  this.render('loading');
  if (Projects.findOne({slug: this.params.slug})) {
    this.render('projectView', {
      data: function () {
        return Projects.findOne({slug: this.params.slug});
      }
    });
  }
});

Router.route('/ideas/:slug/edit', function () {
  if (Ideas.findOne({slug: this.params.slug})) {
    this.render('editIdea', {
      data: function () {
        return Ideas.findOne({slug: this.params.slug});
      }
    });
  }
  document.title = "Edit Idea";
});

Router.route('/projects/:slug/edit', function () {
  if (Projects.findOne({slug: this.params.slug})) {
    this.render('editProject', {
      data: function () {
        return Projects.findOne({slug: this.params.slug});
      }
    });
  }
  document.title = "Edit Project";
});

// Router.route('/search', function(){
//   this.render('search');
//   document.title = "Search";
// });

Router.route('/results', function () {
  this.render('searchResults');
  document.title = "Search Results";
});


Router.route('/portal', function () {
  this.render('portal');
});

Router.route('/settings', function () {
  this.render('settings');
});

// Router.route('/profile', function() {
//   this.render('profile');
// });

Router.route('/:username', function () {
  this.render('loading');
  if (Meteor.users.findOne({username: this.params.username})) {
    this.render('profile', {
      data: function () {
        return Meteor.users.findOne({username: this.params.username});
      }
    });
  }
});

