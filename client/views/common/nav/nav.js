Template.nav.helpers({
  username: function(){
    return Meteor.user().username;
  }
})

Template.nav.events({
  'focus .search-query': function() {
    $('.search-query').keyup(function(){
      var text = $('.search-query').val();
      Session.set('query', text)
    })
  },
  'submit #searchForm': function(){
    Router.go('search');
  },
  'click #signout': function() {
    Meteor.logout();
    Meteor.logoutOtherClients();
    window.location = '/';
    document.title = "Spark";
  },
  'click #portal': function() {
    document.title = 'Portal - Spark';
  },
  'click #profile': function() {
    document.title = 'Profile - Spark';
  },
  'click #settings': function() {
    document.title = 'Settings - Spark';
  }

});

$(window).resize(function() {
  var path = $(this);
  var contW = path.width();
  if(contW >= 751){
    document.getElementsByClassName("sidebar-toggle")[0].style.left="200px";
  }else{
    document.getElementsByClassName("sidebar-toggle")[0].style.left="-200px";
  }
});

$(document).ready(function() {
  $('.dropdown').on('show.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
  });
  $('.dropdown').on('hide.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
  });

  $("#menu-toggle").click(function(e) {
    var elem = document.getElementById("sidebar-wrapper");
    left = window.getComputedStyle(elem,null).getPropertyValue("left");
    if(left === "250px"){
      document.getElementsByClassName("sidebar-toggle")[0].style.left="-250px";
    }
    else if(left === "-250px"){
      document.getElementsByClassName("sidebar-toggle")[0].style.left="250px";
    }
    else {
      document.getElementsByClassName("sidebar-toggle")[0].style.left="250px";
    }
  });
});
