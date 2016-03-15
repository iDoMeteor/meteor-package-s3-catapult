http = Npm.require('http');
var mb = Meteor.settings.slingshot.maxMB;
var types = Meteor.settings.slingshot.mimeTypes;

S3.config = {
  bucket: Meteor.settings.AWSBucketName,
  key: Meteor.settings.AWSAccessKeyId,
  secret: Meteor.settings.AWSSecretAccessKey,
  region: Meteor.settings.AWSRegion || 'us-east-1',
}

Meteor.methods({

  s3GetURL: function(src) {

    check(src, String);
    if (!S3.isValidURL(src)) {
      throw new Meteor.Error('invalid-url', 'Not fetching invalid URL');
    }

    http.get(src, Meteor.bindEnvironment(function(result){

      var headers = {
        'Content-Length': result.headers['content-length'],
        'Content-Type': result.headers['content-type'],
      };
      var name = src.substr(src.lastIndexOf('/') + 1);

      S3.knox.putStream(
        result,
        name,
        headers,
        Meteor.bindEnvironment(function(err, res) {
          var target = (
            res
            && res.req
            && res.req.url
          ) ? res.req.url : null;
          S3.postProcessFetch(
            err,
            target,
            src
          );
          res.resume();
          console.log('done!');
        }));

    }));

  },

});
