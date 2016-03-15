# @iDoMeteor S3 Uploader v0.0.1

## S3 Configuration

You will need to create an S3 bucket with the following CORS configuration:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01">
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

Enter this by clicking on the bucket name, then Properties -> Permissions -> Edit CORS Configuration.

You must also create a set of security keys and put them in the appropriate place in the settings file.

## Packages

Relies on the following packages:

* audit-argument-checks
* blaze-html-templates
* check
* edgee:slingshot
* ejson
* http
* jquery
* logging
* meteor-base
* mobile-experience
* mongo
* random
* reload
* spacebars
* tracker

## Templates

Provides the following templates:

<dl>
  <dt>s3Link</dt>
  <dd>
    Simply provides a link tag named after the URL
  </dd>
  <dt>s3URLs</dt>
  <dd>
    A clickable list of uploaded files wrapped in a div with 's3URLs' class
  </dd>
  <dt>s3UploadURLForm</dt>
  <dd>
    Form with id 's3UploadURL' and a single text input
  </dd>
  <dt>s3UploadFileForm</dt>
  <dd>
    Form with id 's3UploadFileForm' and a single file input
  </dd>
</dl>

Insert {{> s3URLs}}, {{> s3UploadURLForm}} or {{> s3UploadFileForm}} anywhere
inside one of your other application templates.

## API Methods

<dl>
  <dt>getFileFromEvent</dt>
  <dd>
    Returns the file passed to the file input.
  </dd>
  <dt>getFileFromURL</dt>
  <dd>
    Returns the file retrieved from a URL
  </dd>
  <dt>insertURL</dt>
  <dd>
    Inserts a link into the URL collection
  </dd>
  <dt>isAmazonURL</dt>
  <dd>
    Returns true if the URL contains amazonaws.com
  </dd>
  <dt>isHTTPObject</dt>
  <dd>
    Returns true if passed parameters looks like an HTTP.get() result
  </dd>
  <dt>isTemplateInstance</dt>
  <dd>
    Returns true if the parameter is an instance of Blaze.Template
  </dd>
  <dt>isValidURL</dt>
  <dd>
    Returns true if a passed string looks like a URL
  </dd>
  <dt>pressedEnter</dt>
  <dd>
    Returns true if passed a keypress event & enter was pressed
  </dd>
  <dt>postProcess</dt>
  <dd>
    Updates client-side DOM w/error/success messages
  </dd>
  <dt>sanitizeFileName</dt>
  <dd>
    Turns a string into a URL safe string
  </dd>
  <dt>sendFile</dt>
  <dd>
    Takes a file passed to file input and sends it to S3
  </dd>
  <dt>sendToAmazon</dt>
  <dd>
    Actually sends a file to Amazon
  </dd>
  <dt>sendURL</dt>
  <dd>
    Takes the content from a URL and sends it to S3
  </dd>
  <dt>urlExists</dt>
  <dd>
    Checks the database for a file from the passed URL
  </dd>
</dl>

## Browser Policy

If the MDG Browser Policy package is detected, we will add \*.s3.amazonaws.com
to the allowOriginForAll policy.

## Collections

The s3URLs collection is used to store a list of uploaded files.  The allow/deny
model prevents all CRUD operations attempted directly from a client, only server
side manipulations are allowed.

## Publication & Subscriptions

The URLs collection is published to clients and subscribed to when the 's3URLs'
template is created.

## Meteor Methods

<dl>
  <dt>s3InsertURL</dt>
  <dd>
    Safely inserts a validated URL into the URLs collection
  </dd>
</dl>

## Slingshot

Slingshot facilitates S3 session management and related features.  You
can configure it using the Meteor settings provided in the example JSON
settings file.

## Template Helpers

<dl>
  <dt>s3URLs</dt>
  <dd>
    The template is provided a 'urls' helper, a simple list of files
  </dd>
</dt>

## Template Events

<dl>
  <dt>s3UploadURLForm</dt>
  <dd>
    If the user presses enter in the input field or clicks submit, the URL
    will be tested for validity and then streamed to S3
  </dd>
  <dt>s3UploadFileForm</dt>
  <dd>
    When the user selects or drops a file on the input area, the file will be
    send to S3
  </dd>
</dt>
