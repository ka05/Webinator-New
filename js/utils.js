/**
 * Created by Clay on 12/15/2014.
 * Utils - Webinator
 */

// UTILITIES JS
define('utils', ['jquery', 'knockout', 'core-data', 'code-editor', 'bootstrap'], function($, ko, coreData, codeEditor) {
  var self = utils = {},
      notification = {},
      pageContentTmpl = ko.observable("blank-tmpl");


  /**
   * makeRequest: Reduces ajax call code used in other modules
   * Since i am calling the same PHP script i am able to reduce repeated code here
   *
   * @param _data = POST data being sent to server
   * (NOTE: unfortunately i have to sent it in a way that looks like GET
   * ie. "action=someFunction&variableToSend=valueOfVariableToSend" )
   *
   * @param _successFunc = callback function
   * @param _quiet == if i want the message from the server ( results )
   * to be displayed to the user or logged
   */
  self.makeRequest = function(_data, _successFunc, _quiet){
    $.ajax({
      url: "inc/dispatch.php",
      type: 'POST',
      data: _data,
      cache: false,
      dataType: 'json',
      processData: false
    }).done(function (data) {
      //console.log(data);
      if(typeof data =='object'){
        var data = data;
      }else{
        var data = JSON.parse(data);
      }

      // if user feedback is necessary
      if(_quiet){
        console.log(data);
      }else{
        _quiet = false;
        //console.log(data);
        showMessage(data.msg, data.success, 5000);
      }
      _successFunc(data);
    }).fail(function (jqXHR, stat, err) {
      console.log("error: " + err + " Server Response: " + jqXHR.responseText);
    });
  };



  function hideMessage() {
    notification.dismiss();
    $('#msg-div').html("");
  }

  function setPaneHeight() {
    var newHeight = $(window).height() - 100 + "px",
      componentHeight = $(window).height() - 130 + "px",
      tmplHeight = $(window).height() - 140 + "px";
    $('.template-page-cont').each(function () {
      $(this).css('height', tmplHeight);
    });
    $('#components').css('height', componentHeight);
    $('#styling').css('height', componentHeight);
    $('#bootstrap-components').css('height', componentHeight);

  }

  function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
      var textFromFileLoaded = fileLoadedEvent.target.result;
      // document.getElementById("contentInput").value = textFromFileLoaded;
      // do stuff with file
      // call init
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
  }

  function saveTextAsFile(_fileName) {
    // update data in html panel
    codeEditor.updatePanels(currEle);
    var textToWrite = '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
      + '\n<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>'
      + '\n<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>'
      + '\n<link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" rel="stylesheet">'
      + '\n</head>\n<body>\n' + currentDoc
      + '\n<script type="text/javascript">\n' + coreData.currPage.pageJS.replace(/<(?:.|\n)*?>/gm, '') + '\n</script>\n</body>\n</html>';
    var textFileAsBlob = new Blob([textToWrite], {type: 'text/html'});
    // var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = _fileName;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  function enableToolbar(){
    $('#toolbar').find('select').prop('disabled', false);
    $('#toolbar').find('button').prop('disabled', false);
    $('#toolbar').find('input').prop('disabled', false);
  }

  function disableToolbar(){
    $('#toolbar').find('select').prop('disabled', true);
    $('#toolbar').find('button').prop('disabled', true);
    $('#toolbar').find('input').prop('disabled', true);
  }

  // resets all properties and functionality of modals
  function resetModal() {
    if (coreData.currEle) {
      coreData.currEle.popover('hide');
    }

    $('#save-btn').prop('disabled', false);
    $('#save-btn').html('Save');
    $("#save-btn").show();
    $('#save-btn').unbind("click");
    $("#modal-body").html('');
    $("#modal-title").html('');
    $('#delete-btn').hide();
  }

  function clearPages(){
    $('.page-links').each(function () {
      $(this).remove();
    });
  }

  // functions
  self.setPaneHeight = setPaneHeight;
  self.clearPages = clearPages;
  //self.showMessage = showMessage;
  //self.hideMessage = hideMessage;
  self.loadFileAsText = loadFileAsText;
  self.saveTextAsFile = saveTextAsFile;
  self.enableToolbar = enableToolbar;
  self.disableToolbar = disableToolbar;
  self.resetModal = resetModal;

  // variables
  self.pageContentTmpl = pageContentTmpl;

  return self;
});