Template.comment.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  }
});

Template.commentBox.helpers({
	avatar: function() {
		return Meteor.user().avatar;
	}
})