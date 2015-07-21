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