s3URLs = new Meteor.Collection('s3-urls');

s3URLs.allow({
  insert: function() { return false; },
  update: function() { return false; },
  remove: function() { return false; }
});

s3URLs.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});

