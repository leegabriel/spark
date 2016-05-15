Template.editIdea.events({
  'click .update': function (event) {
    var title = document.getElementById('title').innerHTML;
    var details = document.getElementById('details').innerHTML;
    var slug = document.getElementById('slug').innerHTML;
    var tags = document.getElementById('tags').innerHTML.split(', ');

    Meteor.call('editIdea', this._id, title, details, slug, tags);
  }, 
  'click .cancel': function () {
    window.history.back();
  }
});

Template.editIdea.onRendered(function () {
  $('#slug').keyup(function () {
    var text = $('#slug').text();
    $('#liveEdit').text(text);
  })
});