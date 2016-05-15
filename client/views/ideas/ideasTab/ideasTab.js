Template.ideasTab.helpers({
  ideas: function () {
    if (Session.equals('order', 'hot')) {
      return Ideas.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
    }
    else if (Session.equals('order', 'top')) {
      return Ideas.find({}, {sort: {count: -1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
    }
    else if (Session.equals('order', 'newest')) {
      return Ideas.find({}, {sort: {createTimeActual: -1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
    }
    else if (Session.equals('order', 'alphabetical')) {
      return Ideas.find({}, {sort: {title: 1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
    }
    else { /*by default the tab is on hot, in hot order */
      return Ideas.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('iSkip'), limit: Session.get('iLimit')});
    }
  }
});

Template.ideasTab.events({
  "click #hot": function () {
    Session.set('order', 'hot');
  },
  "click #top": function () {
    Session.set('order', 'top');
  },
  "click #newest": function () {
    Session.set('order', 'newest');
  },
  "click #alphabetical": function () {
    Session.set('order', 'alphabetical');
  },
  "click .next": function () {
    var s = Session.get('iSkip');
    s = s + 5;
    Session.set('iSkip', s);
  },
  "click .prev": function () {
    var s = Session.get('iSkip');
    if (s !== 0 && s > 0) {
      s = s - 5;
      Session.set('iSkip', s);
    }
  }
});