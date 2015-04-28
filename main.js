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
      if (!title || !slug || !content)
        return false;
      Meteor.call('addIdea', title, slug, content);
      Router.go('ideas');
      return false;
    }
  }),

  Template.newProject.events({
    'submit .addProjectForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var content = e.target.content.value;
      if (!title || !slug || !content)
        return false;
      Meteor.call('addProject', title, slug, content);
      Router.go('projects');
      return false;
    }
  }),

  Template.idea.events({
    "click .delete": function () {
      Meteor.call("deleteIdea", this._id);
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
  addIdea: function (title, slug, content) {
    Ideas.insert({
      count: 0,
      title: title,
      slug: slug,
      content: content,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: moment().format("MMMM D, YYYY")
    });
  },
  addProject: function (title, slug, content) {
    Projects.insert({
      count: 0,
      title: title,
      slug: slug,
      content: content,
      owner: Meteor.userId(),
      username: Meteor.user().username,
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
  }
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
});

Router.route('/privacy',function() {
  this.render('privacy');
});

Router.route('/developers',function() {
  this.render('developers');
});

Router.route('/artists',function() {
  this.render('artists');
});

Router.route('/about',function() {
  this.render('about');
});



