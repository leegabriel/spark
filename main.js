

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

    // portal tabs
    Session.set('register', false);
    Session.set('signin', true);
    Session.set('forgot', false);
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

}); 