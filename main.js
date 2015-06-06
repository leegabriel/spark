Ideas = new Mongo.Collection('ideas');
Projects = new Mongo.Collection('projects');
Comments = new Mongo.Collection('comments');

Ideas.initEasySearch(['title', 'slug', 'blurb', 'details', 'tags', 'count', 'ownerName', 'createdAt'], {
    // 'limit' : 20,
    'use' : 'mongo-db'
  });


Projects.initEasySearch(['title', 'slug', 'blurb', 'details', 'tags', 'location', 'rewards', 'count', 'ownerName', 'createdAt', 'funded', 'pledged', 'backers'], {
    // 'limit' : 20,
    'use' : 'mongo-db'
  });




if(Meteor.isServer){
  Meteor.publish('ideasList', function(){
    return Ideas.find();
  }),
  Meteor.publish('projectsList', function(){
    return Projects.find();
  }),

  Meteor.publish('commentsList', function() {
    return Comments.find();
  });

  // Accounts.onCreateUser(function(options, user) {
  //   user.profile['username'] = options.username;
  //   return user;
  // });
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

      if (!imageURL){
        imageURL = 'http://lorempixel.com/600/500/';
      }

      if (!title || !slug || !blurb || !details)
        return false;
      Meteor.call('addIdea', title, slug, blurb, imageURL, details, tags);
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
      var goal = e.target.goal.value;
      var duration = e.target.duration.value;
      var location = e.target.location.value;
      var rewards = e.target.rewards.value;

      if (!imageURL){
        imageURL = 'http://lorempixel.com/600/500/';
      }

      if (!title || !slug || !blurb|| !details)
        return false;
      Meteor.call('addProject', title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards);
      Router.go('projects');
      return false;
    }
  }),


  Template.editIdea.events({

    'click .update':function(event){
      var title = document.getElementById('title').innerHTML;
      var slug = document.getElementById('slug').innerHTML;
      var blurb = document.getElementById('blurb').innerHTML;
      var imageURL = document.getElementById('imageURL').innerHTML;
      var details = document.getElementById('details').innerHTML;
      var tags = document.getElementById('tags').innerHTML.split(', ');

      Meteor.call('editIdea', this._id, title, slug, blurb, imageURL, details, tags);
      Router.go('ideas');
    }, 
    'click .cancel':function(){
      window.history.back();
    }
  }),

  Template.editProject.events({
    'click .update':function(event){
      var title = document.getElementById('title').innerHTML;
      var slug = document.getElementById('slug').innerHTML;
      var blurb = document.getElementById('blurb').innerHTML;
      var imageURL = document.getElementById('imageURL').innerHTML;
      var details = document.getElementById('details').innerHTML;
      var tags = document.getElementById('tags').innerHTML.split(', ');
      var goal = document.getElementById('goal').innerHTML;
      var duration = document.getElementById('duration').innerHTML;
      var location = document.getElementById('location').innerHTML;
      var rewards = document.getElementById('rewards').innerHTML;

      Meteor.call('editProject', this._id, title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards);
      Router.go('projects')
    }, 
    'click .cancel':function(){
      window.history.back();
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




  Template.ideaView.events({
    "click .edit": function () {
      var path = '/ideas/' + this.slug + '/edit';
      Router.go(path);
    },
    "click .delete": function () {
      if (confirm("Are you sure you want to delete this?")){
        Meteor.call("deleteIdea", this._id);
      }
    },
    'click #submit-comment': function() {
      // because this is actually an input element, need to use value
      var text = document.getElementById('comment-box').value; 
      Meteor.call('addIdeaComment', this._id, 0, text);
    }
  }),

  Template.ideaView.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
    ideaComments: function () {
      return Comments.find({ideaId:this._id});
    }
  }),



  Template.projectView.events({
    "click .edit": function () {
      var path = '/projects/' + this.slug + '/edit';
      Router.go(path);
    },
    "click .delete": function () {
      if (confirm("Are you sure you want to delete this?")){
        Meteor.call("deleteProject", this._id);
      }
    },
    'click #submit-comment': function() {
      var text = document.getElementById('comment-box').value;
      Meteor.call('addProjectComment', this._id, 0, text);
    }
  }),

  Template.projectView.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    },
    projectComments: function () {
      return Comments.find({projectId:this._id});
    }
  }),





  Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-profile': function(event) {
      Router.go('profile');
    },
    'click #login-buttons-watched': function(event) {
      Router.go('watched');
    },
    'click #login-buttons-stats': function(event) {
      Router.go('stats');
    },
    'click #login-buttons-settings': function(event) {
      Router.go('settings');
    }
  }),




  Template.nav.events({
    'submit .searchForm': function(event) {
      var args = document.getElementById('args').value;
      console.log(args);
      var path = '/search/' + args;
      Router.go(path);
    }
  }),

  Template.pager.events({
    'click .prev': function(event){
      //change cursor
    },
    'click .next': function(event){
      //change cursor
    }

  }),

  Template.comment.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }

  });

} /* isClient */


Meteor.methods({
  addIdea: function (title, slug, blurb, imageURL, details, tags) {
    Ideas.insert({
      title: title,
      slug: slug,
      blurb: blurb,
      imageURL: imageURL,
      details: details,
      tags: tags,
      count: 0,
      owner: Meteor.userId(),
      ownerName: Meteor.user().emails[0].address,
      createdAt: moment().format("MMMM D, YYYY"),
      createTimeActual: moment().format(),
      upvotedUsers: [],
      downvotedUsers: []
    });
  },
  addProject: function (title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards) {
    Projects.insert({
      title: title,
      slug: slug,
      blurb: blurb,
      imageURL: imageURL,
      details: details,
      tags: tags,
      goal: goal,
      duration: duration,
      location: location, 
      rewards: rewards,
      count: 0,
      owner: Meteor.userId(),
      ownerName: Meteor.user().emails[0].address,
      createdAt: moment().format("MMMM D, YYYY"),
      createTimeActual: moment().format(),
      upvotedUsers: [],
      downvotedUsers: [],
      funded: 0,
      pledged: 0,
      backers: 0
    });
  },
  editIdea: function (ideaId, title, slug, blurb, imageURL, details, tags) {
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
        imageURL: imageURL,
        details: details,
        tags: tags
      }});
    }
  },
  editProject: function (projectId, title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards) {
    var project = Projects.findOne(projectId);
    if (project.owner !== Meteor.userId()) {
      // Make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    else {

      Projects.update(projectId, {$set: {
        title: title,
        slug: slug,
        blurb: blurb,
        imageURL: imageURL,
        details: details,
        tags: tags,
        goal: goal,
        duration: duration,
        location: location, 
        rewards: rewards
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
      Router.go('ideas');
      alert("Idea was removed.");
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
      Router.go('projects');
      alert("Project was removed.");
    }
  }, 
  addIdeaComment: function(ideaId, parent, text) {
    Comments.insert({
      ideaId: ideaId,
      parent: parent,
      text: text,
      owner: Meteor.userId(),
      ownerName: Meteor.user().emails[0].address,
      createdAt: moment().format("MMMM D, YYYY"),
      createTimeActual: moment().format()
    });
  },
  addProjectComment: function(projectId, parent, text) {
    Comments.insert({
      projectId: projectId,
      parent: parent,
      text: text,
      owner: Meteor.userId(),
      ownerName: Meteor.user().emails[0].address,
      createdAt: moment().format("MMMM D, YYYY"),
      createTimeActual: moment().format()
    });
  },
  upvoteIdea: function (ideaId) {
    var thisUser = Meteor.userId();
    if (Meteor.userId() === null) {
      // Make sure logged out public can't upvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      if (!(Ideas.findOne({_id: ideaId, upvotedUsers: thisUser}))) {
        Ideas.update(ideaId, { $inc: { count: 1 }});
        Ideas.update(ideaId, { $push: { upvotedUsers: thisUser }});
      }
      else {
        console.log("Did not find idea with this id, or user already upvoted this idea.")
      }
    }
  },
  upvoteProject: function (projectId) {
    var thisUser = Meteor.userId();
    if (Meteor.userId() === null) {
      // Make sure logged out public can't upvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      if (!(Projects.findOne({_id: projectId, upvotedUsers: thisUser}))) {
        Projects.update(projectId, { $inc: { count: 1 }});
        Projects.update(projectId, { $push: { upvotedUsers: thisUser }});
      }
      else{
        console.log("Did not find project with this id, or user already upvoted this project.")
      }
    }
  },
  downvoteIdea: function (ideaId) {
    var thisUser = Meteor.userId();
    if (Meteor.userId() === null) {
      // Make sure logged out public can't downvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      if (!(Ideas.findOne({_id: ideaId, downvotedUsers: thisUser}))) {
        Ideas.update(ideaId, { $inc: { count: -1 }});
        Ideas.update(ideaId, { $push: { downvotedUsers: thisUser }});
      }
      else{
        console.log("Did not find project with this id, or user already downvoted this project.")
      }
    }
  },
  downvoteProject: function (projectId) {
    var thisUser = Meteor.userId();
    if (Meteor.userId() === null) {
      // Make sure logged out public can't downvote it
      throw new Meteor.Error("not-authorized");
    }
    else {
      if (!(Projects.findOne({_id: projectId, downvotedUsers: thisUser}))) {
        Projects.update(projectId, { $inc: { count: -1 }});
        Projects.update(projectId, { $push: { downvotedUsers: thisUser }});
      }
      else {
        console.log("Did not find project with this id, or user already downvoted this project.")
      }
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
  Meteor.subscribe('projectsList'),
  Meteor.subscribe('commentsList')
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


// Router.route('/tos',function() {
//   window.scrollTo(0,0);
//   this.render('tos');
//   document.title = "Spark | Terms of Service";
// });

// Router.route('/privacy',function() {
//   window.scrollTo(0,0);
//   this.render('privacy');
//   document.title = "Spark | Privacy Policy";
// });

// Router.route('/developers',function() {
//   window.scrollTo(0,0);
//   this.render('developers');
//   document.title = "Spark | Developers";
// });

// Router.route('/artists',function() {
//   window.scrollTo(0,0);
//   this.render('artists');
//   document.title = "Spark | Artists";
// });

// Router.route('/about',function() {
//   window.scrollTo(0,0);
//   this.render('about');
//   document.title = "Spark | About";
// });


Router.route('/:_id', function(){
  window.scrollTo(0,0);
  document.title = "Spark";
  this.render('loading');
  if (Meteor.users.findOne({_id: Meteor.userId()})) {
    this.render('profile', {
      data: function(){
        return Meteor.users.findOne({_id: Meteor.userId()});
      }
    });
  }
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

Router.route('/search', function(){
  window.scrollTo(0,0);
  this.render('search');
  document.title = "Search";
});

Router.route('/results', function(){
  window.scrollTo(0,0);
  this.render('searchResults');
  document.title = "Search Results";
});




