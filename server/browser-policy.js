Meteor.startup(function() {
  // Configure Browser Policy
  if ('object' == typeof(BrowserPolicy)) {
    BrowserPolicy.content.allowOriginForAll('*.s3.amazonaws.com');
    BrowserPolicy.content.allowSameOriginForAll();
  }
});
