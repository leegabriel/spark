Ideas = new Mongo.Collection('ideas');
Projects = new Mongo.Collection('projects');

if(Meteor.isServer){
  Meteor.publish('ideasList', function(){
    return Ideas.find();
  }),
  Meteor.publish('projectsList', function(){
    return Projects.find();
  })
}

if (Meteor.isClient) {
  Template.ideasTab.helpers({
    ideas: function () {
      return Ideas.find({}, {sort: {createdAt: 1}});
    }
  }),

  Meteor.subscribe('ideasList'),

  Template.projectsTab.helpers({
    projects: function () {
      return Projects.find({}, {sort: {createdAt: 1}});
    }
  }),

  Meteor.subscribe('projectsList'),

  Template.newIdea.events({
    'submit .addIdeaForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var content = e.target.content.value;
      var imageURL = e.target.banner.value;
      if (!title || !slug || !content || !imageURL)
        return false;
      Meteor.call('addIdea', title, slug, content, imageURL);
      Router.go('ideas');
      return false;
    }
  }),

  Template.newProject.events({
    'submit .addProjectForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var content = e.target.content.value;
      var imageURL = e.target.banner.value;
      if (!title || !slug || !content || !imageURL)
        return false;
      Meteor.call('addProject', title, slug, content, imageURL);
      Router.go('projects');
      return false;
    }
  }),

  Template.idea.events({
    "click .delete": function () {
      Meteor.call("deleteIdea", this._id);
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
      Meteor.call("deleteProject", this._id);
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
}

Meteor.methods({
  addIdea: function (title, slug, content, imageURL) {
    Ideas.insert({
      count: 0,
      title: title,
      slug: slug,
      content: content,
      category: "none",
      owner: Meteor.userId(),
      username: Meteor.user().username,
      imageURL: imageURL,
      createdAt: moment().format("MMMM D, YYYY")
    });
  },
  addProject: function (title, slug, content, imageURL) {
    Projects.insert({
      count: 0,
      title: title,
      slug: slug,
      category: "none",
      content: content,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      imageURL: imageURL,
      createdAt: moment().format("MMMM D, YYYY")
    });
  },
  deleteIdea: function (ideaId) {
    var idea = Ideas.findOne(ideaId);
    if (idea.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Ideas.remove(ideaId);
  },
  deleteProject: function (projectId) {
    var project = Projects.findOne(projectId);
    if (project.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Projects.remove(projectId);
  }, 
  upvoteIdea: function (ideaId) {
    Ideas.update(ideaId, { $inc: { count: 1} });
  },
  upvoteProject: function (projectId) {
    Projects.update(projectId, { $inc: { count: 1} });
  },
  downvoteIdea: function (ideaId) {
    Ideas.update(ideaId, { $inc: { count: -1} });
  },
  downvoteProject: function (projectId) {
    Projects.update(projectId, { $inc: { count: -1} });
  }
});


Router.configure({
 notFoundTemplate: '404'
});

Router.route('/', function() {
  this.render('home');
});

Router.route('/ideas', function() {
  this.render('ideasTab');
});

Router.route('/projects',function() {
  this.render('projectsTab');
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



