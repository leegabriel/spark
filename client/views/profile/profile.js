Template.profile.helpers({
	username: function() {
		return Meteor.user().username;
	},
	avatar: function() {
		return Meteor.user().avatar;
	},
	points: function() {
		return Meteor.user().points;
	},
	followers: function() {
		return Meteor.user().followers;
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
	else{
		return;
	}
});