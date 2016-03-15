S3 = {

  getFileFromEvent: function (event) {
    return event.target.files[0];
  },

  getFileFromURL: function (url, callback) {

    if (!this.isValidURL(url)) {
      if ('function' == typeof(callback)) callback ('Invalid URL');
      return;
    }

    HTTP.get(url, {
      timeout: Meteor.settings.public.httpTimeout,
    }, function (error, result) {

      S3.log('Result from HTTP:' + JSON.stringify({
        error: error,
        result: result
      }));
      // Result = {statusCode, content, data, headers}
      if ('function' == typeof(callback)) callback (error, result);

    });

  },

  insertURL: function (url, callback) {

    if (!this.isValidURL(url)) {
      if ('function' == typeof(callback)) callback ('Invalid URL');
      return;
    }

    Meteor.call( "s3InsertURL", url);

  },

  isAmazonURL: function (value) {
    return (
      'string' == typeof(value)
      && /^.*\.amazonaws\.com.*$/.test(value)
    );
  },

  isHTTPObject: function (value) {

    return (
      ('object' == typeof(value))
       && ('number' == typeof(value.statusCode))
    )

  },

  isTemplateInstance: function(value) {
    return value instanceof Blaze.TemplateInstance;
  },

  isValidFile: function (value) {
    return (
      (value instanceof File)
      || (value instanceof Blob)
    );

  },

  isValidURL: function (value) {
    return (
      ('string' == typeof(value))
      && /^https?:\/\/.*\/.+$/.test(value)
    );
  },

  log: function (value) {

    if (Meteor.isServer && !Meteor.settings.debug) return;
    if (Meteor.isClient && !Meteor.settings.public.debug) return;

    if ('string' == typeof(value)) {
      console.log(value);
    }
    else if ('object' == typeof(value)) {
      console.log(JSON.stringify(value, null, 2));
    }

  },

  pressedEnter: function(event) {

    var key = (event && event.which)
      ? event.which
      : event;

    return (
      (10 == key)
      || (13 == key)
    );

  },

  postProcessAmazon: function(options) {

    if ('object' != typeof(options)) {
      S3.log('S3 ERROR Invalid call to S3 post processor');
      return;
    }
    var error = options.error || undefined;
    var url = options.url || undefined;

    if (error) {
      S3.log('S3 ERROR ' + JSON.stringify(error));
      return;
    }

    if (url) {
      S3.log('S3 SUCCESS Inserting ' + url);
      S3.insertURL(url);
      return;
    }

    S3.log('S3 ERROR Unexpected end to S3 post processor');

  },

  postProcessFetch: function(error, target, src) {

    if (error) {
      S3.log('S3 ERROR: ' + JSON.stringify(error, null, 2));
      return;
    }

    if (S3.isValidURL(target)) {
      S3.log('S3 SUCCESS Copied '
             + src
             + ' to '
             + target);
      Meteor.call( "s3InsertURL", target);
    } else {
      S3.log('Failed to process fetch: ' + JSON.stringify({
        error: error,
      }, null, 2));
    }



  },

  postProcessInsert: function(error, id, url) {

    if (error) {
      S3.log('S3 ERROR ' + error);
    }
    if (id) {
      S3.log('S3 SUCCESS Inserted new link with ID: ' + id);
    }

  },

  sanitizeFileName: function (value) {

    return ('string' == typeof(value))
      ? encodeURIComponent(value)
      : '';

  },

  sendFile: function (options, callback) {

    var file = this.getFileFromEvent(options.event);

    S3.log('file: ' + JSON.stringify(_.keys(file)));
    this.sendToAmazon(file);

  },

  sendToAmazon: function (file) {

    var sender = new Slingshot.Upload("sendToS3" );

    if (!this.isValidFile(file)) {
      this.postProcessAmazon({error: 'Invalid file format'});
    }

    sender.send(file, function (error, url) {
      S3.log('S3 DEBUG Return from sender: ' + JSON.stringify({
        error: error,
        url: url,
      }));
      S3.postProcessAmazon({
        error: error,
        url: url,
      });
    });

  },

  sendURL: function (url, callback) {

    if (!this.isValidURL(url)) {
      if ('function' == typeof(callback)) callback ('Invalid URL');
      return;
    }

    //var base = 'https://mastermindjamtest.s3-us-west-2.amazonaws.com/';
    //var name = url.substr(url.lastIndexOf('/') + 1);
    //var target = base + name;
    //console.log('target: ' + target);
    Meteor.call('s3GetURL', url);
    //Meteor.call('s3InsertURL', target);
    $('.s3-url-input').val('');

  },

  urlExists: function (value) {

    if (this.isValidURL(value)) {
      return s3URLs.findOne({
        url: value
      });
    }

  },

}
