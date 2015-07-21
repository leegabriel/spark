Template.nav.events({
  'focus .search-query': function() {
    $('.search-query').keyup(function(){
      var text = $('.search-query').val();
      Session.set('query', text)
    })
  },
  'submit #searchForm': function(){
    Router.go('search')
  }
});