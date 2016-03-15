// Publish URLs
Meteor.publish( 's3urls', function(){
  return s3URLs.find({}, {sort: {stamp: -1}}) || this.ready();
});
