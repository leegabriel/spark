Template.projectsTab.helpers({
  projects: function () {
    if (Session.equals('order', 'hot')) {
      return Projects.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
    }
    else if (Session.equals('order', 'top')) {
      return Projects.find({}, {sort: {count: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
    }
    else if (Session.equals('order', 'newest')) {
      return Projects.find({}, {sort: {createTimeActual: -1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
    }
    else if (Session.equals('order', 'alphabetical')) {
      return Projects.find({}, {sort: {title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
    }
    else { /*by default the tab is on hot, in hot order */
      return Projects.find({}, {sort: {count: -1, createTimeActual: -1, title: 1}, skip: Session.get('pSkip'), limit: Session.get('pLimit')});
    }
  }
});

Template.projectsTab.events({
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
    var s = Session.get('pSkip');
    s = s + 5;
    Session.set('pSkip', s);
  },
  "click .prev": function () {
    var s = Session.get('pSkip');
    if (s !== 0 && s > 0) {
      s = s - 5;
      Session.set('pSkip', s);
    }
  }
});