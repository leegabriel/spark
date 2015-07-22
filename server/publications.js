Meteor.publish('ideasList', function(){
  return Ideas.find();
});
Meteor.publish('projectsList', function(){
  return Projects.find();
});

Meteor.publish('commentsList', function() {
  return Comments.find();
});

Meteor.publish('tagsList', function(){
  return Tags.find();
});

Meteor.publish('userData', function() {
  return Meteor.users.find(Meteor.userId(), {fields: {
    avatar: 1,
    points: 1,
    followers: 1
  }});
});

