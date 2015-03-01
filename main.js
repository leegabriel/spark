Ideas = new Mongo.Collection("ideas");
Projects = new Mongo.Collection("projects");

if(Meteor.isServer){
  Meteor.publish('ideaslist', function(){
    return Ideas.find();
  });
  Meteor.publish('projectslist', function(){
    return Projects.find();
  });
}

if (Meteor.isClient) {
  Template.ideastab.helpers({
    ideas: function () {
      return Ideas.find({}, {sort: {createdAt: 1}});
    }
  });
  Meteor.subscribe('ideaslist');

  Template.projectstab.helpers({
    ideas: function () {
      return Projects.find({}, {sort: {createdAt: 1}});
    }
  });
  Meteor.subscribe('projectslist');

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
  });

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
  });

}

Meteor.methods({
  addIdea: function (title, slug, content) {
    Ideas.insert({
      title: title,
      slug: slug,
      content: content,
      createdAt: moment().format("dddd D MMMM YYYY")
    });
  },
  addProject: function (title, slug, content) {
    Projects.insert({
      title: title,
      slug: slug,
      content: content,
      createdAt: moment().format("dddd D MMMM YYYY")
    });
  }
});

Router.route('/', function() {
  this.render('main');
});

Router.route('/ideas', function() {
  this.render('ideastab');
});

Router.route('/projects',function() {
  this.render('projectstab');
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
