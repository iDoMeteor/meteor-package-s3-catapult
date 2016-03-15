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
      $('.s3-url-input').val('');
      S3.insertURL(url);
      return;
    }

    S3.log('S3 ERROR Unexpected end to S3 post processor');

  },

  postProcessFetch: function(error, result, url) {

    // Result = {statusCode, content, data, headers}
    var binaryArray = [];
    var binaryString = '';
    var blob = null;
    var content = null;
    var data = null;
    var date = null;
    var file = null;
    var i = 0;
    var length = null;
    var name = null;
    var type = null;

    if (this.isHTTPObject(result) && (200 == result.statusCode)) {
      // Format file properties
      content = (result.content) ? result.content : null;
      data = (result.data) ? result.data : null;
      date = result.headers['last-modified'] || new Date();
      length = result.headers['content-length'] || _.keys(content).length;
      name = url.substr(url.lastIndexOf('/') + 1) || this.sanitizeFileName(date);
      type = result.headers['content-type'] || 'application/octet-stream';

      S3.log('Processing fetch: ' + JSON.stringify({
        name: name,
        date: date,
        type: type,
        url: url,
        content: content,
        data: data,
      }, null, 2));

      /*
      length = content.byteLength;
      delete content.byteLength;
      binaryArray = new Uint8Array(length);
      _.each (content, function (value, key) {
        binaryArray[1*key] = (String.fromCharCode(value));
      });
      binaryString = binaryArray.join('');
      console.log(binaryString);
      console.log(btoa(binaryString));
      console.log(atob(binaryString));
      */

      // Create blob & file
      file = new File (
        [content],
        name,
        {
          type: type,
          lastModified: date,
        }
      );

      // Send retrieved file to S3
      this.sendToAmazon(file);
    } else {
      S3.log('Failed to process fetch: ' + JSON.stringify({
        error: error,
        result: result,
        url: url,
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

    Meteor.call('s3GetURL', url, function (error, result) {
      S3.postProcessFetch(error, result, url);
    });

  },

  urlExists: function (value) {

    if (this.isValidURL(value)) {
      return s3URLs.findOne({
        url: value
      });
    }

  },

}
