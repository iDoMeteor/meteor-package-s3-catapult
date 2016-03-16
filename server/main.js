http = Npm.require('http');
var mb = Meteor.settings.Catapult.maxMB;
var types = Meteor.settings.Catapult.mimeTypes;

S3.config = {
  bucket: Meteor.settings.AWSBucketName,
  key: Meteor.settings.AWSAccessKeyId,
  secret: Meteor.settings.AWSSecretAccessKey,
  region: Meteor.settings.AWSRegion || 'us-east-1',
}

Slingshot.fileRestrictions( "sendToS3", {
  allowedFileTypes: types,
  maxSize: mb * 1024 * 1024
});

Slingshot.createDirective( "sendToS3", Slingshot.S3Storage, {
  acl: Meteor.settings.AWSACL,
  authorize: function () {
    return true;
  },
  bucket: Meteor.settings.AWSBucketName,
  key: function (file) {
    return encodeURIComponent(
      file.name
    );
  },
  region: Meteor.settings.AWSRegion || 'us-east-1',
});

Meteor.methods({

  s3GetURL: function(src) {

    check(src, String);
    if (!S3.isValidURL(src)) {
      throw new Meteor.Error('invalid-url', 'Not fetching invalid URL');
    }
    src = src.replace(/^https/, 'http');

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
          S3.postProcessAmazon({
            error: err,
            target: target,
            source: src,
          });
          res.resume();
          S3.log('S3 DEBUG Finished sending stream to Amazon.');
        }));

        S3.log('S3 DEBUG Finished receiving stream from URL.');

    }));

  },

});
