Template.s3URLs.onCreated(function () {
  this.subscribe('s3urls');
});


Template.s3URLs.helpers({

  urls: function () {
    // Need loading feature
    return s3URLs.find({}, {sort: {'stamp': -1}});
  },

});


Template.s3UploadFileForm.events({

  'change input[type="file"]' (event, template) {
    S3.log('S3 DEBUG Sending file.');
    S3.sendFile({event: event, template: template});
  },

});


Template.s3UploadURLForm.events({

  'click button': function (event, template) {
    event.preventDefault();
    var url = template.$('input').val();
    template.$('.s3-url-input').val('');
    S3.log('Sending ' + url + ' via button click');
    S3.sendURL(url);
  },

  'keypress input': function (event, template) {
    if (!S3.pressedEnter(event.which)) return;
    event.preventDefault();
    var url = $(event.target).val();
    $(event.target).val('');
    S3.log('Sending ' + url + ' via keypress');
    S3.sendURL(url);
  },

});
