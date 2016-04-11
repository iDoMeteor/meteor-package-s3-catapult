S3 = {

  getFileFromEvent: function (event) {
    var file = event.target.files[0] || null;
    S3.log('S3 DEBUG Selected file is valid: ' + S3.isValidFile(file));
    return file;
  },

  // Unused but worth keeping
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

  isString: function (value) {
    return ('string' == typeof(value));
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

  isValidSlug: function(value) {
    if (!this.isString(value)) return false;
    if (!value.trim().length) return false;
    return (
      (/[^\w\._~-]/.test(value))
        || (/--/.test(value))
    ) ? false : true;
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
    var source = options.source || undefined;
    var target = options.target || undefined;
    var url = options.url || undefined;

    if (error) {
      S3.log('S3 ERROR ' + JSON.stringify(error));
    }

    if (this.isValidURL(target)) {
      this.log('S3 SUCCESS Copied '
             + source
             + ' to '
             + target);
      Meteor.call( "s3InsertURL", target);
    } else if (this.isValidURL(url)) {
      this.log('S3 SUCCESS Uploaded file to ' + url);
      Meteor.call( "s3InsertURL", url);
    } else {
      this.log('Failed to process fetch: ' + JSON.stringify({
        error: error,
      }, null, 2));
    }

  },

  postProcessInsert: function(error, id, url) {

    if (error) {
      S3.log('S3 WARNING ' + error);
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
    var template = options.template;

    this.sendToAmazon(file);

  },

  sendToAmazon: function (file) {

    var sender = new Slingshot.Upload("sendToS3" );

    if (this.isValidFile(file)) {
      this.log('S3 DEBUG Sending file to Amazon');
    } else {
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

  sendURL: function (url, name, prefix) {

    if (!this.isValidURL(url)) {
      if ('function' == typeof(callback)) callback ('Invalid URL');
      return;
    }
    if (name && !this.isValidSlug(name)) {
      name = this.stringToSlug(name) || null;
    }
    if (prefix && !this.isString(prefix)) {
      prefix = null;
    }

    Meteor.call('s3GetURL', url, name, prefix);

  },

  stringToSlug: function(string) {

    // Validate
    if (!this.isString(string)) {
      return false;
    }
    var slug = string.toLowerCase().trim();

    // Convert non-alpha chars to - cuz I hate typing _
    slug = slug.replace(/[\W]/g, '-');
    // Consolidate multiple hyphens
    slug = slug.replace(/-{2,}/g, '-');

    return slug;

  },

  urlExists: function (value) {

    if (this.isValidURL(value)) {
      return s3URLs.findOne({
        url: value
      });
    }

  },

}
