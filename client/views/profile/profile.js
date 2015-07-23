Template.profile.helpers({
	userIdeas: function() {
		return Ideas.find({ownerName: this.username});
	},
	userProjects: function() {
		return Projects.find({ownerName: this.username});
	}
});





