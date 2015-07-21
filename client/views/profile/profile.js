Template.profile.helpers({
	username: function() {
		return Meteor.user().username;
	},
	avatar: function() {
		return Meteor.user().avatar;
	},
	myIdeas: function() {
		return Ideas.find({ownerName: Meteor.user().username});
	},
	myProject: function() {
		return Projects.find({ownerName: Meteor.user().username});
	}
})