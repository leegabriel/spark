Template.editProject.events({
  'click .update':function(event){
    var title = document.getElementById('title').innerHTML;
    var slug = document.getElementById('slug').innerHTML;
    var blurb = document.getElementById('blurb').innerHTML;
    var imageURL = document.getElementById('imageURL').innerHTML;
    var details = document.getElementById('details').innerHTML;
    var tags = document.getElementById('tags').innerHTML.split(', ');
    var goal = document.getElementById('goal').innerHTML;
    var duration = document.getElementById('duration').innerHTML;
    var location = document.getElementById('location').innerHTML;
    var rewards = document.getElementById('rewards').innerHTML;

    Meteor.call('editProject', this._id, title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards);
  }, 
  'click .cancel':function(){
    window.history.back();
  }
});