Template.s3URLs.onCreated(function () {
  this.subscribe('s3urls');
});


Template.s3URLs.helpers({

  urls: function () {
    return s3URLs.find({}, {sort: {'stamp': -1}});
  },

});


Template.s3UploadURLForm.events({

  'click button': function (event, template) {
    var url = template.$('input').val();
    event.preventDefault();
    console.log('trying to send ' + url + ' via button click');
    S3.sendURL(url, function (error, result) {
      S3.postProcess({
        error: error,
        result: result,
        template: template,
      });
    });
  },

  'keypress input': function (event, template) {
    if (!S3.pressedEnter(event.which)) return;
    event.preventDefault();
    var url = $(event.target).val();
    console.log('trying to send ' + url + ' via keypress');
    S3.sendURL(url, function (error, result) {
      S3.postProcess({
        error: error,
        result: result,
        template: template,
      });
    });
  },

});


Template.s3UploadFileForm.events({

  'change input[type="file"]' (event, template) {
    S3.sendFile({event: event, template: template});
  },

});
