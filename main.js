Ideas = new Mongo.Collection('ideas');
Projects = new Mongo.Collection('projects');
Comments = new Mongo.Collection('comments');
Tags = new Mongo.Collection('tags');

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
  }),

  Meteor.publish('tagsList', function(){
    return Tags.find();
  })

} /* isServer */


if (Meteor.isClient) {

  Meteor.startup(function () {

    //search
    Session.set('query', '');

    //pagination
    Session.set('iSkip', 0);
    Session.set('iLimit', 5);
    Session.set('pSkip', 0);
    Session.set('pLimit', 5);

    //newProject tabs
    Session.set('basicsTab', true);
    Session.set('rewardsTab', false);
    Session.set('storyTab', false);
    Session.set('aboutTab', false);
    Session.set('accountTab', false);
    Session.set('previewTab', false);
  });

  Template.search.helpers({
    query: function() {
      return Session.get('query');
    }
  });
  
  Template.sortBar.events({
    'click #hot': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('hot').innerHTML;
   },
   'click #top': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('top').innerHTML;
   },
   'click #newest': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('newest').innerHTML;
   },
   'click #alphabetical': function() {
     document.getElementById('sortChoice').innerHTML = document.getElementById('alphabetical').innerHTML;
   },
 }),

  Template.ideasTab.helpers({
    ideas: function () {
      if (Session.equals('order', 'hot')) {
        return Ideas.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
      }
      else if (Session.equals('order', 'top')){
        return Ideas.find({}, {sort: {count: -1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
      }
      else if (Session.equals('order', 'newest')) {
        return Ideas.find({}, {sort: {createTimeActual: -1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
      }
      else if (Session.equals('order', 'alphabetical')) {
        return Ideas.find({}, {sort: {title: 1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
      }
      else { /*by default the tab is on hot, in hot order */
        return Ideas.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
      }
    }
  }),

  Template.ideasTab.events({
    "click #hot": function(){
      Session.set('order', 'hot');
    },
    "click #top": function(){
      Session.set('order', 'top');
    },
    "click #newest": function(){
      Session.set('order', 'newest');
    },
    "click #alphabetical": function(){
      Session.set('order', 'alphabetical');
    },
    "click .next": function() {
      var s = Session.get('iSkip');
      s = s + 5;
      Session.set('iSkip', s);
    },
    "click .prev": function() {
      var s = Session.get('iSkip');
      if (s !== 0 && s > 0){
        s = s - 5;
        Session.set('iSkip', s);
      }
    }
  }),


  Template.projectsTab.helpers({
    projects: function () {
      if (Session.equals('order', 'hot')) {
        return Projects.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      }
      else if (Session.equals('order', 'top')){
        return Projects.find({}, {sort: {count: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      }
      else if (Session.equals('order', 'newest')) {
        return Projects.find({}, {sort: {createTimeActual: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      }
      else if (Session.equals('order', 'alphabetical')) {
        return Projects.find({}, {sort: {title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      }
      else { /*by default the tab is on hot, in hot order */
        return Projects.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
      }
    }
  }),

  Template.projectsTab.events({
    "click #hot": function(){
      Session.set('order', 'hot');
    },
    "click #top": function(){
      Session.set('order', 'top');
    },
    "click #newest": function(){
      Session.set('order', 'newest');
    },
    "click #alphabetical": function(){
      Session.set('order', 'alphabetical');
    },
    "click .next": function() {
      var s = Session.get('pSkip');
      s = s + 5;
      Session.set('pSkip', s);
    },
    "click .prev": function() {
      var s = Session.get('pSkip');
      if (s !== 0 && s > 0){
        s = s - 5;
        Session.set('pSkip', s);
      }
    }
  }),





  Template.newIdea.events({
    'submit .addIdeaForm':function(e){
      var title = e.target.title.value;
      var slug = e.target.slug.value;
      var tags = e.target.tags.value.split(', ');
      var details = e.target.details.value;

      
      var imageURL = 'http://lorempixel.com/600/500/abstract';

      if (!title || !details || !slug)
        return false;
      Meteor.call('addIdea', title, slug, tags, details, imageURL);
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
        imageURL = 'http://lorempixel.com/600/500/abstract';
      }

      if (!title || !slug || !blurb|| !details)
        return false;
      Meteor.call('addProject', title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards);
      return false;
    },
    'click #basicsTab': function () {
      Session.set('basicsTab', true);
      Session.set('rewardsTab', false);
      Session.set('storyTab', false);
      Session.set('aboutTab', false);
      Session.set('accountTab', false);
      Session.set('previewTab', false);
    },
    'click #rewardsTab': function () {
      Session.set('basicsTab', false);
      Session.set('rewardsTab', true);
      Session.set('storyTab', false);
      Session.set('aboutTab', false);
      Session.set('accountTab', false);
      Session.set('previewTab', false);
    },
    'click #storyTab': function () {
      Session.set('basicsTab', false);
      Session.set('rewardsTab', false);
      Session.set('storyTab', true);
      Session.set('aboutTab', false);
      Session.set('accountTab', false);
      Session.set('previewTab', false);
    },
    'click #aboutTab': function () {
      Session.set('basicsTab', false);
      Session.set('rewardsTab', false);
      Session.set('storyTab', false);
      Session.set('aboutTab', true);
      Session.set('accountTab', false);
      Session.set('previewTab', false);
    },
    'click #accountTab': function () {
      Session.set('basicsTab', false);
      Session.set('rewardsTab', false);
      Session.set('storyTab', false);
      Session.set('aboutTab', false);
      Session.set('accountTab', true);
      Session.set('previewTab', false);
    },
    'click #previewTab': function () {
      Session.set('basicsTab', false);
      Session.set('rewardsTab', false);
      Session.set('storyTab', false);
      Session.set('aboutTab', false);
      Session.set('accountTab', false);
      Session.set('previewTab', true);
    },
  }),

Template.newProject.helpers({
  basicsTab: function() {
    return Session.get('basicsTab');
  },
  rewardsTab: function() {
    return Session.get('rewardsTab');
  },
  storyTab: function() {
    return Session.get('storyTab');
  },
  aboutTab: function() {
    return Session.get('aboutTab');
  },
  accountTab: function() {
    return Session.get('accountTab');
  },
  previewTab: function() {
    return Session.get('previewTab');
  }
}),


Template.editIdea.events({
  'click .update':function(event){
    var title = document.getElementById('title').innerHTML;
    var details = document.getElementById('details').innerHTML;
    var slug = document.getElementById('slug').innerHTML;
    var tags = document.getElementById('tags').innerHTML.split(', ');

    Meteor.call('editIdea', this._id, title, details, slug, tags);
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
  },
  submittedAgo: function() {
    return moment(this.createTimeActual, moment.ISO_8601).fromNow();
  },
  numComments: function() {
    var numComments = Comments.find({ideaId: this._id}).count();
    if (numComments === 1) {
      return '1 comment';
    }
    else
      return numComments + ' comments';
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
  },
  submittedAgo: function() {
    return moment(this.createTimeActual, moment.ISO_8601).fromNow();
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
  },
  submittedAgo: function() {
    return moment(this.createTimeActual, moment.ISO_8601).fromNow();
  },
  numComments: function() {
    var numComments = Comments.find({ideaId: this._id}).count();
    if (numComments === 1) {
      return '1 comment';
    }
    else
      return numComments + ' comments';
  },
  processedTags: function() {
    var oldTags = this.tags;
    var newTags =[oldTags.length];
    for (var i = 0; i < oldTags.length; i++){
      newTags[i] = '<a href="#">#' + oldTags[i] + '</a> ';
    }
    var processedTags ='';
    for (var k = 0; k < oldTags.length; k++){
      processedTags = processedTags + newTags[k] + ' ';
    }
    return processedTags;
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
  },
  'click #fund': function() {
    bootbox.dialog({
      title: this.title,
      message: '<div class="row">  ' +
      '<div class="col-md-12"> ' +
      '<h3>Let\'s choose your reward!</h3>' + 
      '</div> </div>',
      buttons: {
        success: {
          label: "Continue",
          className: "btn-success",
          callback: function () {
            var name = $('#name').val();
            var answer = $("input[name='awesomeness']:checked").val()
          }
        }
      }
    }
    );
  }
}),

Template.projectView.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  },
  projectComments: function () {
    return Comments.find({projectId:this._id});
  },
  submittedAgo: function() {
    return moment(this.createTimeActual, moment.ISO_8601).fromNow();
  },
  numComments: function() {
    var numComments = Comments.find({projectId: this._id}).count();
    if (numComments === 1) {
      return '1 comment';
    }
    else
      return numComments + ' comments';
  },
  processedTags: function() {
    var oldTags = this.tags;
    var newTags =[oldTags.length];
    for (var i = 0; i < oldTags.length; i++){
      newTags[i] = '<a href="#">#' + oldTags[i] + '</a> ';
    }
    var processedTags ='';
    for (var k = 0; k < oldTags.length; k++){
      processedTags = processedTags + newTags[k] + ' ';
    }
    return processedTags;
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
  'focus .search-query': function() {
    $('.search-query').keyup(function(){
      var text = $('.search-query').val();
      Session.set('query', text)
    })
  },
  'submit #searchForm': function(){
    Router.go('search')
  }
}),

Template.comment.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  }
});



} /* isClient */


Meteor.methods({
  addIdea: function (title, slug, tags, details, imageURL) {
    Ideas.insert({
      title: title,
      slug: slug,
      tags: tags,
      details: details,
      imageURL: imageURL,
      count: 0,
      owner: Meteor.userId(),
      ownerName: Meteor.user().emails[0].address,
      createdAt: moment().format("MMMM D, YYYY"),
      createTimeActual: moment().format(),
      upvotedUsers: [],
      downvotedUsers: []
    });
    if (Meteor.isClient){
      Router.go('ideas'); 
      bootbox.alert("Idea created!"); 
    } 
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
    if (Meteor.isClient) {
      Router.go('projects');
      bootbox.alert("Project created!");
    }
  },
  editIdea: function (ideaId, title, details, slug, tags) {
    var idea = Ideas.findOne(ideaId);
    if (idea.owner !== Meteor.userId()) {
      // Make sure only the owner can edit it
      throw new Meteor.Error("not-authorized");
    }
    else {

      Ideas.update(ideaId, {$set: {
        title: title,
        details: details,
        slug: slug,
        details: details,
        tags: tags
      }});
      if (Meteor.isClient){
        Router.go('ideas');
        bootbox.alert("Idea updated!");
      }

    }
  },
  editProject: function (projectId, title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards) {
    var project = Projects.findOne(projectId);
    if (project.owner !== Meteor.userId()) {
      // Make sure only the owner can edit it
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
      if (Meteor.isClient) {
        Router.go('projects');
        bootbox.alert("Project updated!");
      }
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
      if (Meteor.isClient){
        Router.go('ideas');
        bootbox.alert("Idea deleted!");  
      }
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
      if (Meteor.isClient){
        Router.go('projects');
        bootbox.alert("Project deleted!");
      }
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
    }
  }

}); /* methods */


/* Routes */

Router.onBeforeAction(function(){
  window.scrollTo(0,0);
  this.next();
});


Router.configure({
 notFoundTemplate: 'pageNotFound',
 loadingTemplate: 'loading', 
 waitOn: function() {
  return [
  Meteor.subscribe('ideasList'),
  Meteor.subscribe('projectsList'),
  Meteor.subscribe('commentsList'),
  Meteor.subscribe('tagsList')
  ];
}
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

Router.route('/newproject', function(){
  this.render('newProject');
});

Router.route('/ideas/:slug', function(){
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
  if (Projects.findOne({slug: this.params.slug})) {
    this.render('editProject', {
      data: function(){
        return Projects.findOne({slug: this.params.slug});
      }
    });
  }
  document.title = "Edit Project";
});


Router.route('/watched',function() {
  this.render('watched');
  document.title = "Spark";
});

Router.route('/stats',function() {
  this.render('stats');
  document.title = "Spark";
});


Router.route('/settings',function() {
  this.render('settings');
  document.title = "Spark";
});

Router.route('/search', function(){
  this.render('search');
  document.title = "Search";
});

Router.route('/results', function(){
  this.render('searchResults');
  document.title = "Search Results";
});




