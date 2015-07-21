Template.comment.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  }
});