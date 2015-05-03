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

  Meteor.subscribe('ideasList'),

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

  Meteor.subscribe('projectsList'),

  Template.newIdea.events({
    'submit .addIdeaForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var blurb = e.target.blurb.value;
      var imageURL = e.target.image.value;
      var details = e.target.details.value;

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

      if (!title || !slug || !blurb || !imageURL || !details)
        return false;
      Meteor.call('addProject', title, slug, blurb, imageURL, details);
      Router.go('projects');
      return false;
    }
  }),

  Template.idea.events({
    "click .delete": function () {
      var result;
      if (confirm("Are you sure you want to delete this?")){
        result = Meteor.call("deleteIdea", this._id);
      }
    },
    "click .fa-chevron-up": function () {
      Meteor.call("upvoteIdea", this._id);
    },
    "click .fa-chevron-down": function () {
      Meteor.call("downvoteIdea", this._id);
    }
  });

  Template.idea.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.project.events({
    "click .delete": function () {
      var result;
      if (confirm("Are you sure you want to delete this?")){
        result = Meteor.call("deleteProject", this._id);
      }
    },
    "click .fa-chevron-up": function () {
      Meteor.call("upvoteProject", this._id);
    },
    "click .fa-chevron-down": function () {
      Meteor.call("downvoteProject", this._id);
    }
  });

  Template.project.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
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
 notFoundTemplate: 'pageNotFound'
});

Router.route('/', function() {
  this.render('home');
});

Router.route('/ideas', function() {
  this.render('ideasTab');
  document.title = "Spark | Ideas";
});

Router.route('/projects',function() {
  this.render('projectsTab');
  document.title = "Spark | Projects"
});

Router.route('/newidea', function(){
  this.render('newIdea');
});

Router.route('/ideas/:slug', function(){
  this.render('ideaView', {
    data: function(){
      return Ideas.findOne({slug: this.params.slug});
    }
  });
});

Router.route('/newproject', function(){
  this.render('newProject');
});

Router.route('/projects/:slug', function(){
  this.render('projectView', {
    data: function(){
      return Projects.findOne({slug: this.params.slug});
    }
  });
});

Router.route('/tos',function() {
  this.render('tos');
  document.title = "Spark | Terms of Service";
});

Router.route('/privacy',function() {
  this.render('privacy');
  document.title = "Spark | Privacy Policy";
});

Router.route('/developers',function() {
  this.render('developers');
  document.title = "Spark | Developers";
});

Router.route('/artists',function() {
  this.render('artists');
  document.title = "Spark | Artists";
});

Router.route('/about',function() {
  this.render('about');
  document.title = "Spark | About";
});

Router.route('/landing',function() {
  this.render('landing');
  document.title = "Spark";
});




