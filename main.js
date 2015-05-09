Ideas = new Mongo.Collection('ideas');
Projects = new Mongo.Collection('projects');


if(Meteor.isServer){
  Meteor.publish('ideasList', function(){
    return Ideas.find();
  }),
  Meteor.publish('projectsList', function(){
    return Projects.find();
  })
} /* isServer */


if (Meteor.isClient) {

  Template.ideasTab.helpers({
    ideas: function () {
      if (Session.equals('order', 'hot')) {
        return Ideas.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}});
      }
      else if (Session.equals('order', 'top')){
        return Ideas.find({}, {sort: {count: -1}});
      }
      else if (Session.equals('order', 'newest')) {
        return Ideas.find({}, {sort: {createTimeActual: -1}});
      }
      else if (Session.equals('order', 'promoted')) {
        return Ideas.find({}, {sort: {title: 1}});
      }
      else { /*by default the tab is on hot, in hot order */
        return Ideas.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}});
      }
    }
  }),

  Template.ideasTab.events({
    "click .hot": function(){
      Session.set('order', 'hot');
    },
    "click .top": function(){
      Session.set('order', 'top');
    },
    "click .newest": function(){
      Session.set('order', 'newest');
    },
    "click .promoted": function(){
      Session.set('order', 'promoted');
    }
  }),


  Template.projectsTab.helpers({
    projects: function () {
      if (Session.equals('order', 'hot')) {
        return Projects.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}});
      }
      else if (Session.equals('order', 'top')){
        return Projects.find({}, {sort: {count: -1}});
      }
      else if (Session.equals('order', 'newest')) {
        return Projects.find({}, {sort: {createTimeActual: -1}});
      }
      else if (Session.equals('order', 'promoted')) {
        return Projects.find({}, {sort: {title: 1}});
      }
      else { /*by default the tab is on hot, in hot order */
        return Projects.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}});
      }
    }
  }),

  Template.projectsTab.events({
    "click .hot": function(){
      Session.set('order', 'hot');
    },
    "click .top": function(){
      Session.set('order', 'top');
    },
    "click .newest": function(){
      Session.set('order', 'newest');
    },
    "click .promoted": function(){
      Session.set('order', 'promoted');
    }
  }),


  Template.newIdea.events({
    'submit .addIdeaForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var blurb = e.target.blurb.value;
      var imageURL = e.target.image.value;
      var details = e.target.details.value;
      var tags = e.target.tags.value.split(', ');

      if (!title || !slug || !blurb || !imageURL || !details)
        return false;
      Meteor.call('addIdea', title, slug, blurb, imageURL, details);
      Router.go('ideas');
      return false;
    }
  }),


  Template.newProject.events({
    'submit .addProjectForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var blurb = e.target.blurb.value;
      var imageURL = e.target.image.value;
      var details = e.target.details.value;
      var tags = e.target.tags.value.split(', ');

      if (!title || !slug || !blurb || !imageURL || !details)
        return false;
      Meteor.call('addProject', title, slug, blurb, imageURL, details);
      Router.go('projects');
      return false;
    }
  }),

  Template.editIdea.events({
    'submit .editIdeaForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var blurb = e.target.blurb.value;
      var imageURL = e.target.image.value;
      var details = e.target.details.value;
      var tags = e.target.tags.value.split(', ');

      if (!title || !slug || !blurb || !imageURL || !details)
        return false;
      Meteor.call('editIdea', this._id, title, slug, blurb, tags, imageURL, details);
      Router.go('ideas');
      return false;
    }
  }),

  Template.editProject.events({
    'submit .editProjectForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var blurb = e.target.blurb.value;
      var imageURL = e.target.image.value;
      var details = e.target.details.value;
      var tags = e.target.tags.value.split(', ');

      if (!title || !slug || !blurb || !imageURL || !details)
        return false;
      Meteor.call('editProjectIdea', this._id, title, slug, blurb, tags, imageURL, details);
      Router.go('projects');
      return false;
    }
  }),

  Template.idea.events({
    "click .edit": function () {
      var path = '/ideas/' + this.slug + '/edit';
      Router.go(path);
    },
    "click .delete": function () {
      if (confirm("Are you sure you want to delete this?")){
        Meteor.call("deleteIdea", this._id);
      }
    },
    "click .fa-chevron-up": function () {
      Meteor.call("upvoteIdea", this._id);
    },
    "click .fa-chevron-down": function () {
      Meteor.call("downvoteIdea", this._id);
    }
  }),

  Template.idea.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  }),


  Template.project.events({
    "click .edit": function () {
      var path = '/projects/' + this.slug + '/edit';
      Router.go(path);
    },
    "click .delete": function () {
      if (confirm("Are you sure you want to delete this?")){
        Meteor.call("deleteProject", this._id);
      }
    },
    "click .fa-chevron-up": function () {
      Meteor.call("upvoteProject", this._id);
    },
    "click .fa-chevron-down": function () {
      Meteor.call("downvoteProject", this._id);
    }
  }),

  Template.project.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  }),

  Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-myIdeas': function(event) {
      Router.go('myideas');
    },
    'click #login-buttons-myProjects': function(event) {
      Router.go('myprojects');
    },
    'click #login-buttons-profile': function(event) {
      Router.go('profile');
    },
    'click #login-buttons-watched': function(event) {
      Router.go('watched');
    },
    'click #login-buttons-stats': function(event) {
      Router.go('stats');
    },
    'click #login-buttons-gold': function(event) {
      Router.go('gold');
    },
    'click #login-buttons-settings': function(event) {
      Router.go('settings');
    }
  });

} /* isClient */


Meteor.methods({
  addIdea: function (title, slug, blurb, imageURL, details) {
    Ideas.insert({
      count: 0,
      title: title,
      slug: slug,
      blurb: blurb,
      tags: "none",
      owner: Meteor.userId(),
      ownerName: Meteor.user().username,
      imageURL: imageURL,
      details: details,
      createdAt: moment().format("MMMM D, YYYY"),
      createTimeActual: moment().format('MMMM Do YYYY, h:mm:ss a')
    });
  },
  addProject: function (title, slug, blurb, imageURL, details) {
    Projects.insert({
      count: 0,
      title: title,
      slug: slug,
      tags: "none",
      blurb: blurb,
      owner: Meteor.userId(),
      ownerName: Meteor.user().username,
      imageURL: imageURL,
      details: details,
      createdAt: moment().format("MMMM D, YYYY"),
      createTimeActual: moment().format('MMMM Do YYYY, h:mm:ss a')
    });
  },
  editIdea: function (ideaId, title, slug, blurb, tags, imageURL, details) {
    var idea = Ideas.findOne(ideaId);
    if (idea.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    else {
      
      Ideas.update(ideaId, {$set: {
        title: title,
        slug: slug,
        blurb: blurb,
        tags: tags,
        imageURL: imageURL,
        details: details
      }});
    }
  },
  editProject: function (projectId, title, slug, blurb, tags, imageURL, details) {
    var project = Projects.findOne(ideaId);
    if (project.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    else {
      
      Projects.update(projectId, {$set: {
        title: title,
        slug: slug,
        blurb: blurb,
        tags: tags,
        imageURL: imageURL,
        details: details
      }});
    }
  },
  deleteIdea: function (ideaId) {
    var idea = Ideas.findOne(ideaId);
    if (idea.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    else {
      Ideas.remove(ideaId);
    }
  },
  deleteProject: function (projectId) {
    var project = Projects.findOne(projectId);
    if (project.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    else {
      Projects.remove(projectId);
    }
  }, 
  upvoteIdea: function (ideaId) {
    if (Meteor.userId() === null) {
      // Make sure logged out public can't upvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      Ideas.update(ideaId, { $inc: { count: 1} });
    }
  },
  upvoteProject: function (projectId) {
    if (Meteor.userId() === null) {
      // Make sure logged out public can't upvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      Projects.update(projectId, { $inc: { count: 1} });
    }
  },
  downvoteIdea: function (ideaId) {
    if (Meteor.userId() === null) {
      // Make sure logged out public can't upvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      Ideas.update(ideaId, { $inc: { count: -1} });
    }
  },
  downvoteProject: function (projectId) {
    if (Meteor.userId() === null) {
      // Make sure logged out public can't upvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      Projects.update(projectId, { $inc: { count: -1} });
    }
  }

}); /* methods */


/* Routes */

Router.configure({
 notFoundTemplate: 'pageNotFound',
 loadingTemplate: 'loading', 
 waitOn: function() {
  return [
  Meteor.subscribe('ideasList'),
  Meteor.subscribe('projectsList')
  ];
}
});


Router.route('/', function() {
  window.scrollTo(0,0);
  this.render('home');
});

Router.route('/ideas', function() {
  window.scrollTo(0,0);
  this.render('ideasTab');
  document.title = "Spark | Ideas";
});

Router.route('/projects',function() {
  window.scrollTo(0,0);
  this.render('projectsTab');
  document.title = "Spark | Projects"
});

Router.route('/newidea', function(){
  window.scrollTo(0,0);
  this.render('newIdea');
});

Router.route('/newproject', function(){
  window.scrollTo(0,0);
  this.render('newProject');
});

Router.route('/ideas/:slug', function(){
  window.scrollTo(0,0);
  this.render('loading');
  if (Ideas.findOne({slug: this.params.slug})) {
    this.render('ideaView', {
      data: function(){
        return Ideas.findOne({slug: this.params.slug});
      }
    });
  }
});

Router.route('/projects/:slug', function(){
  window.scrollTo(0,0);
  this.render('loading');
  if (Projects.findOne({slug: this.params.slug})) {
    this.render('projectView', {
      data: function(){
        return Projects.findOne({slug: this.params.slug});
      }
    });
  }
});

Router.route('/ideas/:slug/edit', function(){
  window.scrollTo(0,0);
  var ideaSlug = Session.get('choice');
  if (Ideas.findOne({slug: this.params.slug})) {
    this.render('editIdea', {
      data: function(){
        return Ideas.findOne({slug: this.params.slug});
      }
    });
  }
  document.title = "Edit Idea";
});

Router.route('/projects/:slug/edit', function(){
  window.scrollTo(0,0);
  if (Projects.findOne({slug: this.params.slug})) {
    this.render('editProject', {
      data: function(){
        return Projects.findOne({slug: this.params.slug});
      }
    });
  }
  document.title = "Edit Project";
});


Router.route('/tos',function() {
  window.scrollTo(0,0);
  this.render('tos');
  document.title = "Spark | Terms of Service";
});

Router.route('/privacy',function() {
  window.scrollTo(0,0);
  this.render('privacy');
  document.title = "Spark | Privacy Policy";
});

Router.route('/developers',function() {
  window.scrollTo(0,0);
  this.render('developers');
  document.title = "Spark | Developers";
});

Router.route('/artists',function() {
  window.scrollTo(0,0);
  this.render('artists');
  document.title = "Spark | Artists";
});

Router.route('/about',function() {
  window.scrollTo(0,0);
  this.render('about');
  document.title = "Spark | About";
});

Router.route('/landing',function() {
  window.scrollTo(0,0);
  this.render('landing');
  document.title = "Spark";
});

Router.route('/myideas',function() {
  window.scrollTo(0,0);
  this.render('myIdeas');
  document.title = "Spark";
});

Router.route('/myprojects',function() {
  window.scrollTo(0,0);
  this.render('myProjects');
  document.title = "Spark";
});


Router.route('/profile',function() {
  window.scrollTo(0,0);
  this.render('profile');
  document.title = "Spark";
});

Router.route('/watched',function() {
  window.scrollTo(0,0);
  this.render('watched');
  document.title = "Spark";
});

Router.route('/stats',function() {
  window.scrollTo(0,0);
  this.render('stats');
  document.title = "Spark";
});

Router.route('/gold',function() {
  window.scrollTo(0,0);
  this.render('gold');
  document.title = "Spark";
});

Router.route('/settings',function() {
  window.scrollTo(0,0);
  this.render('settings');
  document.title = "Spark";
});




