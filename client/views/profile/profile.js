Template.profile.helpers({
	username: function() {
		return Meteor.user().username;
	},
	avatar: function() {
		return Meteor.user().avatar;
	}
})