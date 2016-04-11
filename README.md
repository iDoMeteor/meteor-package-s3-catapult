# @iDoMeteor S3 Uploader v0.0.2

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

## Meteor.settings

<dl>
  <dt>AWSACL</dt>
  <dd>
    Amazon Web Services Access Control List for sent files
  </dd>
  <dt>AWSAccessKeyId</dt>
  <dd>
    Your AWS access key
  </dd>
  <dt>AWSBucketName</dt>
  <dd>
    The name of your S3 bucket
  </dd>
  <dt>AWSRegion</dt>
  <dd>
    The x-xx-x string representing your bucket region, if not us-east-1
  </dd>
  <dt>AWSSecretAccessKey</dt>
  <dd>
    Your AWS secret key
  </dd>
  <dt>debug</dt>
  <dd>
    If set to true, output debugging messages, otherwise do not
  </dd>
  <dt>public.debug</dt>
  <dd>
    Same as above but for client-side messages
  </dd>
  <dt>public.httpTimeout</dt>
  <dd>
    Max amount of time to wait for return for file transfer from client-side URL to finish
  </dd>
  <dt>Catapult.mimeTypes</dt>
  <dd>
    List of MIME type codes to accept for client-side URL transfers
  </dd>
  <dt>Catapult.maxMB</dt>
  <dd>
    Max file size for client-side URL transfers
  </dd>
  <dt>Catapult.saveSourceLinksToDb</dt>
  <dd>
    Keep log of source links, feature not yet available
  </dd>
  <dt>Catapult.saveTargetLinksToDb</dt>
  <dd>
    Keep log of source links for s3URLs helper, currently always true
  </dd>
</dl>

## Packages

Relies on the following packages:

* aldeed:http
* blaze-html-templates
* check
* edgee:slingshot
* ejson
* jquery
* lepozepo:s3
* logging
* meteor-base
* mongo
* npm.http
* random
* reload
* spacebars
* tracker
* underscore

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
    Returns the file retrieved from a URL to the client, unused
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
  <dt>log</dt>
  <dd>
    Processes debugging messages
  </dd>
  <dt>pressedEnter</dt>
  <dd>
    Returns true if passed a keypress event & enter was pressed
  </dd>
  <dt>postProcessAmazon</dt>
  <dd>
    Ensures all went well with xfer to Amazon then calls the URL insertion
  </dd>
  <dt>postProcessInsert</dt>
  <dd>
    Just logs success or failure of call to s3InsertURL
  </dd>
  <dt>sanitizeFileName</dt>
  <dd>
    Turns a string into a URL safe string
  </dd>
  <dt>sendFile</dt>
  <dd>
    Validates a file passed to file input and sends it to sendToAmazon
  </dd>
  <dt>sendToAmazon</dt>
  <dd>
    Actually sends a file to Amazon
  </dd>
  <dt>sendURL</dt>
  <dd>
    Validates a URL and sends it to Meteor.call('s3GetURL', url);
  </dd>
  <dt>urlExists</dt>
  <dd>
    Checks the database for a file from the passed URL
  </dd>
</dl>

## Browser Policy

If the MDG Browser Policy package is detected, we will add \*.s3.amazonaws.com
to the allowOriginForAll policy.  Probably won't work without it. :)

## Collections

The s3URLs collection is used to store a list of uploaded files.  The allow/deny
model prevents all CRUD operations attempted directly from a client, only server
side manipulations are allowed.

## Publication & Subscriptions

The URLs collection is published to clients and subscribed to when the 's3URLs'
template is created.  All allow rules return true, as do all the deny rules,
thereby only allowing db manipulation from server-side code.

## Meteor Methods

<dl>
  <dt>s3GetURL</dt>
  <dd>
    Downloads a file from a given URL and sends it to Amazon, with optional name
    and prefix parameters.
  </dd>
  <dt>s3InsertURL</dt>
  <dd>
    Safely inserts a validated URL into the URLs collection
  </dd>
</dl>

## Template Helpers

<dl>
  <dt>s3URLs</dt>
  <dd>
    The template is provided a 'urls' helper, a simple list of files
  </dd>
</dt>

## Template Events

<dl>
  <dt>s3UploadFileForm</dt>
  <dd>
    When the user selects or drops a file on the input area, the file will be
    send to S3
  </dd>
  <dt>s3UploadURLForm</dt>
  <dd>
    If the user presses enter in the input field or clicks submit, the URL
    will be tested for validity and then streamed to S3
  </dd>
</dt>


## Version History

### v0.0.2

* Added optional name and prefix parameters to sendURL and s3GetURL

