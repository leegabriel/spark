Template.settings.events({
	'click #change-password': function() {
		oldpass = document.getElementById('current-password').value;
		newpass = document.getElementById('new-password').value;
		Accounts.changePassword(oldpass, newpass, function(err){
			if(err){
				alert("There was a problem. Please try again.");
			}
			else{
				alert("Your password has been changed.");
				document.getElementById('current-password').value = null;
				document.getElementById('new-password').value = null;
			}
		});
	},
	'click #change-avatar': function() {
		newpic = document.getElementById('avatar-link').value;
		userId = Meteor.userId();
		Meteor.call('updateAvatar', userId, newpic);
	}

});