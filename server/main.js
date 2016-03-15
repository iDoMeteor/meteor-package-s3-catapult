var mb = Meteor.settings.slingshot.maxMB;
var types = Meteor.settings.slingshot.mimeTypes;

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

  s3GetURL: function(url) {

    check(url, String);
    if (!S3.isValidURL(url)) {
      throw new Meteor.Error('invalid-url', 'Not fetching invalid URL');
    }

    var result = HTTP.call('GET', url, {
      responseType: 'buffer',
      timeout: Meteor.settings.public.httpTimeout,
    });

    // try making file from blob here and returning
    // try faking input.files[0]
    // try appending into dom
    // try saving to fs
    // try jquery.ajax
    // try request

    result.content = new Buffer(result.content).toString('base64');
    return result;

  },

});
