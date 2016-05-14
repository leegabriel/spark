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

Meteor.publish('usersList', function() {
  return Meteor.users.find({}, {fields: {
    _id: 1,
    username: 1,
    joinDate: 1,
    avatar: 1,
    points: 1,
    followers: 1,
  }});
});