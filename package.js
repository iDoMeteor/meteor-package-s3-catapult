var packages = [
  'aldeed:http@0.2.2',
  'blaze-html-templates',
  'check',
  'edgee:slingshot@0.7.1',
  'lepozepo:s3@5.1.6',
  'ejson',
  'jquery',
  'logging',
  'meteor-base',
  'mongo',
  'random',
  'reload',
  'spacebars',
  'tracker',
  'underscore',
];

var filesClient = [
  'client/main.html',
  'client/main.js',
];

var filesLib = [
  'lib/api.js',
  'lib/collections.js',
  'lib/methods.js',
];

var filesServer = [
  'server/browser-policy.js',
  'server/publications.js',
  'server/main.js',
];

Package.describe({
  name: 'idometeor:s3-catapult',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Provides Blaze templates for sending files to Amazon S3 via file input or URL.',
  // URL to the Git repository containing the source code for this package.
  git: 'http://github.com/iDoMeteor/meteor-s3-catapult',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(packages);
  api.addFiles(filesLib, ['client', 'server']);
  api.addFiles(filesServer, 'server');
  api.addFiles(filesClient, 'client');
  api.export([
    'S3',
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('idometeor:s3-catapult');
  api.addFiles('s3-catapult-tests.js');
});
