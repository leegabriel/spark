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
});

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
});