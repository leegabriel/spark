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
  });

Template.ideaView.helpers({
  isOwner: function () {
    return this.ownerId === Meteor.userId();
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
});