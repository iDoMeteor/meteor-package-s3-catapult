Meteor.methods({

  s3InsertURL: function(url) {

    check(url, String);
    if (!S3.isValidURL(url)) {
      S3.postProcessInsert('Not inserting invalid URL');
      return;
    }
    if (S3.urlExists(url)) {
      S3.postProcessInsert('Not inserting duplicate URL');
      return;
    }

    var obj = {
      url: url,
      stamp: new Date() ,
    };

    s3URLs.insert(obj, function (error, id) {
      S3.postProcessInsert(error, id, url);
    });

  },

});
