Template.profile.helpers({
	avatar: function() {
		return Meteor.users.findOne({_id: Meteor.userId()}).avatar;
	},
	username: function() {
		return Meteor.users.findOne({_id: Meteor.userId()}).username;
	},
	points: function() {
		return Meteor.users.findOne({_id: Meteor.userId()}).points.toString();
	},
	followers: function() {
		return Meteor.users.findOne({_id: Meteor.userId()}).spacecraft;
	},
	myIdeas: function() {
		return Ideas.find({ownerName: Meteor.user().username});
	},
	myProjects: function() {
		return Projects.find({ownerName: Meteor.user().username});
	}
});

Deps.autorun(function(){ 
	if (Meteor.user()){
		Meteor.subscribe('userData');
	}
});

