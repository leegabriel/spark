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
  },
  'click #basicsTab': function () {
    Session.set('basicsTab', true);
    Session.set('rewardsTab', false);
    Session.set('storyTab', false);
    Session.set('aboutTab', false);
    Session.set('accountTab', false);
    Session.set('previewTab', false);
  },
  'click #rewardsTab': function () {
    Session.set('basicsTab', false);
    Session.set('rewardsTab', true);
    Session.set('storyTab', false);
    Session.set('aboutTab', false);
    Session.set('accountTab', false);
    Session.set('previewTab', false);
  },
  'click #storyTab': function () {
    Session.set('basicsTab', false);
    Session.set('rewardsTab', false);
    Session.set('storyTab', true);
    Session.set('aboutTab', false);
    Session.set('accountTab', false);
    Session.set('previewTab', false);
  },
  'click #aboutTab': function () {
    Session.set('basicsTab', false);
    Session.set('rewardsTab', false);
    Session.set('storyTab', false);
    Session.set('aboutTab', true);
    Session.set('accountTab', false);
    Session.set('previewTab', false);
  },
  'click #accountTab': function () {
    Session.set('basicsTab', false);
    Session.set('rewardsTab', false);
    Session.set('storyTab', false);
    Session.set('aboutTab', false);
    Session.set('accountTab', true);
    Session.set('previewTab', false);
  },
  'click #previewTab': function () {
    Session.set('basicsTab', false);
    Session.set('rewardsTab', false);
    Session.set('storyTab', false);
    Session.set('aboutTab', false);
    Session.set('accountTab', false);
    Session.set('previewTab', true);
  },
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
