Template.comment.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  },
  ownerAvatar: function() {
  	return Meteor.users.findOne({username: this.owner}).avatar;
  }
});

Template.commentBox.helpers({
	avatar: function() {
		return Meteor.user().avatar;
	}
})