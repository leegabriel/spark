Template.newIdea.events({
  'submit .addIdeaForm': function (e) {
    var title = e.target.title.value;
    var slug = e.target.slug.value;
    var tags = e.target.tags.value.split(', ');
    var details = e.target.details.value;
    var imageURL = 'http://lorempixel.com/600/500/abstract';

    if (!title || !details || !slug)
      return false;

    Meteor.call('addIdea', title, slug, tags, details, imageURL);
    return false;
  }
});

Template.newIdea.onRendered(function () {
  $('#slug').keyup(function () {
    var text = $('#slug').val();
    $('#liveEdit').text(text);
  })

  document.title = "New Idea";

  window.onload = function() {
    document.getElementById("title").focus();
  };
});