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

  s3GetURL: function(url, name, prefix) {

    check(url, String);
    check(name, Match.Optional(String));
    check(prefix, Match.Optional(String));

    if (S3.isValidURL(url)) {
      url = url.replace(/^https/, 'http');
    } else {
      throw new Meteor.Error('invalid-url', 'Not fetching invalid URL');
    }
    if (!S3.isValidSlug(name)) {
      name = S3.stringToSlug(name) || url.substr(7);
    }
    if (S3.isString(prefix)) {
      if ('/' != prefix.substr(prefix.length - 1)) {
        prefix = prefix + '/';
      }
    } else {
      prefix = '/';
    }

    http.get(url, Meteor.bindEnvironment(function(result){

      var headers = {
        'Content-Length': result.headers['content-length'],
        'Content-Type': result.headers['content-type'],
      };

      var destination = prefix + name;

      S3.knox.putStream(
        result,
        destination,
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
            source: url,
          });
          res.resume();
          S3.log('S3 DEBUG Finished sending stream to Amazon.');
        }));

        S3.log('S3 DEBUG Finished receiving stream from URL.');

    }));

  },

});
