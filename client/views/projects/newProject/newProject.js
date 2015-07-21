 Template.newProject.events({
  'submit .addProjectForm':function(e){
    var title = e.target.title.value;
    var slug = e.target.slug.value;
    var blurb = e.target.blurb.value;
    var imageURL = e.target.image.value;
    var details = e.target.details.value;
    var tags = e.target.tags.value.split(', ');
    var goal = e.target.goal.value;
    var duration = e.target.duration.value;
    var location = e.target.location.value;
    var rewards = e.target.rewards.value;

    if (!imageURL){
      imageURL = 'http://lorempixel.com/600/500/abstract';
    }

    if (!title || !slug || !blurb|| !details)
      return false;
    Meteor.call('addProject', title, slug, blurb, imageURL, details, tags, goal, duration, location, rewards);
    return false;
  }
});

 Template.newProject.helpers({
  basicsTab: function() {
    return Session.get('basicsTab');
  },
  rewardsTab: function() {
    return Session.get('rewardsTab');
  },
  storyTab: function() {
    return Session.get('storyTab');
  },
  aboutTab: function() {
    return Session.get('aboutTab');
  },
  accountTab: function() {
    return Session.get('accountTab');
  },
  previewTab: function() {
    return Session.get('previewTab');
  }
});
