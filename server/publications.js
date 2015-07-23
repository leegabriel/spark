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

Meteor.publish("userData",function(username){

    var user = Meteor.users.findOne({username:username});
    // if we can't find it, mark the subscription as ready and quit
    if(!user){
        this.ready();
        return;
    }
    return Meteor.users.find(this.userId);

});