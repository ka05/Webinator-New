/**
 * Created by Clay on 12/20/2014.
 * ele-tools : Webinator
 *
 * contains element manipulation
 */

define('ele-tools', ['jquery', 'knockout', 'utils', 'core-data', 'file-menu', 'drag-drop', 'bootstrap', 'jquery.contextmenu'], function($, ko, utils, coreData, fileMenu, dragDrop) {
  var self = eleTools = {};


  function addOption(_ele, _value, _text){
    _ele.find('select').append('<option value="' + _value + '">' + _text + '</option>');
    fileMenu.editOptions();
  }

  function removeOption(_val){
    currEle.find('option[value='+ _val + ']').remove();
  }

  function addRadioName(_val){
    console.log('dumb');
    $('#edit-radio-tbl').find('.radio-group-name').each(function(){
      $(this).html(_val);
    });
    currEle.find('input[type=radio]').each(function () {
      $(this).attr('name', _val);
    });
  }

  function addRadio(_ele, _value, _text, _id, _name){
    if(_value != "" && _text != "" && _id != ""){
      _ele.append('<div class="radio-group" data-div="' + _id + '"><input type="radio" name="' + _name + '" id="' + _id + '" value="' + _value + '"><label for="radio-btn-3">' + _text + '</label></div>');
      editRadioBtns();
    }
    else{
      $('#radio-empty-input-err').show();
    }
  }

  function removeRadio(_val){
    console.log(_val);
    currEle.find('.radio-group').each(function() {
      if($(this).attr('data-div') == _val){
        $(this).remove();
      }
      console.log($(this).attr('data-div'));
    });
  }



  function addCheckbox(_ele, _value, _text, _id, _name){
    if(_value != "" && _text != "" && _id != ""){
      _ele.append('<div class="checkbox-group" data-div="' + _id + '"><input type="checkbox" name="' + _name + '" id="' + _id + '" value="' + _value + '"><label for="' + _id + '">' + _text + '</label></div>');
      editCheckBoxes();
    }
    else{
      $('#checkbox-empty-input-err').show();
    }
  }

  function removeCheckbox(_val){
    currEle.find('.checkbox-group').each(function() {
      if($(this).attr('data-div') == _val){
        $(this).remove();
      }
    });
  }


  function toggleStyle(_type, _value){
    if(currEle.css(_type) != _value){
      changeEleStyle(_type, _value);
    }
    else{
      changeEleStyle(_type, "");
    }
  }


  function changeEleStyle(_type, _value){
    currEle.css(_type, _value);
  }

  function changeEleTag(_newTag){
    var oldEleAttr = currEle.getAttributes(),
      newEle = $('<' + _newTag + '>').html(currEle.html());
    currEle.replaceWith(newEle);
    newEle.setAttributes(oldEleAttr);

    newEle.draggable({
      containment: '#template-page-cont'
    });
  }

  function addPlaceholderText(_text){
    currEle.find("input").attr("placeholder", _text);
  }

  function addFillerTxt(){
    currEle.append("<br>Nunc vehicula lacinia ante non hendrerit. Morbi sit amet ornare felis. Sed tempus pretium mollis. \
                  Etiam fringilla lacus eget tellus rutrum lacinia. Vestibulum ultrices posuere lectus, et accumsan mauris viverra nec.\
                  Praesent imperdiet diam ante, sed porta elit tempus eget. Proin sit amet nibh sed felis molestie pellentesque sed ac ante.\
                  Integer gravida, risus at euismod rhoncus, elit purus pulvinar ante, at auctor leo elit quis erat.");
  }

  // called after a new element has been dragged onto template
  function postDragOutElement(_ele){
    var menu1 = [
      {'Insert Element':function(menuItem,menu) { insertElement(_ele); } },
      $.contextMenu.separator,
      {'Add ID':function(menuItem,menu) { addAnId(_ele); } },
      {'Add Class':function(menuItem,menu) { addAClass(_ele); } },
      {'Add an Event':function(menuItem,menu) { showEventModal(_ele); } },
      $.contextMenu.separator,
      {'Move Forward':function(menuItem,menu) { moveForward(_ele); } },
      {'Move Backward':function(menuItem,menu) { moveBackward(_ele); } },
      $.contextMenu.separator,
      {'Copy':function(menuItem,menu) { copyElement(_ele) } },
      {'Cut':function(menuItem,menu) { cutElement(_ele) } },
      {'Paste':function(menuItem,menu) { pasteElement(_ele) } },
      {'Delete':function(menuItem,menu) { deleteElement(_ele) } }
    ];
    $(function() {
      _ele.contextMenu(menu1,{theme:'gloss'});
    });
  }

  function moveForward(_ele){
    console.log(_ele.css('z-index'));
    _ele.css('z-index', (parseInt(_ele.css('z-index')) + 1));
    console.log(_ele.css('z-index'));
  }

  function moveBackward(_ele){
    console.log(_ele.css('z-index'));
    _ele.css('z-index', (_ele.css('z-index') - 1));
    console.log(_ele.css('z-index'));
  }



  // deletes the selected element
  function deleteElement(_currEle){
    coreData.PROCESSDOCUMENT.append(_currEle.clone());
    console.log(coreData.PROCESSDOCUMENT.html());
    $('.ui-selected').popover('destroy');
    $('.ui-selected').remove();

    $('.editing').popover('destroy');
    $('.editing').remove();

    _currEle.popover("destroy");
    _currEle.remove();
  }

  function copyElement(){
    var newEle = coreData.currEle.clone();
    newEle.prependTo('#template-page-cont');

    initDraggable(newEle);
  }

  function preCutEle(){
    coreData.currEle.resizable("destroy");
    coreData.currEle.popover("hide");
  }

  function cutElement(_currEle){
    preCutEle();
    coreData.cutEle = _currEle.clone(coreData.cutEle);
    coreData.PROCESSDOCUMENT.append();
    console.log(coreData.PROCESSDOCUMENT.html());

    _currEle.remove();
  }

  function pasteElement(){
    if(coreData.cutEle){
      $('#template-page-cont').append(coreData.cutEle);
      initDraggable(coreData.cutEle);

      coreData.cutEle.resizable({
        handles:"all"
      });

    }
  }

  function undoAction(_ele){
    console.log("undo: ele: " +_ele);
    console.log(coreData.PROCESSDOCUMENT.html());
    console.log(coreData.PROCESSDOCUMENT.children().eq(0));
    var restoredEle = coreData.PROCESSDOCUMENT.children().eq(0);
    dragDrop.initDraggable(restoredEle);
    $('#template-page-cont').append(restoredEle);
  }

  function redoAction(_ele){
    console.log("undo: ele: " +_ele);
  }


  // displays modal for inserting an element
  function insertElement(){
    utils.resetModal();
    // show modal here
    $('#modal').modal('show');
    fileMenu.modalTitle('Insert and Element');
    $("#modal-body").html('some buttons and dropdowns will be here eventually.');
  }

  function showEventModal(){
    utils.resetModal();
    $('#modal').modal('show');
    fileMenu.modalTitle('Add event');
    fileMenu.modalBodyTmpl("event-creator-tmpl");

    if(coreData.currEle){
      fileMenu.modalTitle("Add event to this " + coreData.currEle.prop("tagName"));
      if(coreData.currEle.id){
        clickBindSaveBtn();
      }
      else{
        $('#save-btn').prop('disabled', true);
        $('#id-input-div').show();
        $('#event-type-id-error').show();
      }

    }
    else{
      $('#add-event-error').show();
      fileMenu.modalTitle("Add event to : nothing selected");
      $('#save-btn').prop('disabled', true);
      $('#save-btn').on('click', function(){
        showMessage("must select and element first", "error", 4000);
        console.info('must select and element first');
      });
    }
  }

  function clickBindSaveBtn(){
    $('#save-btn').on('click', function(){
      if(!$('input:radio[name=event-type]:checked').val()){
        $('#event-type-selection-error').show();
      }
      else{
        attachCustomFunct();
        //console.log(JSFILE);
        $('#modal').modal('hide');
      }
    });
  }

  function addID(_ele) {
    if($('#id-name-input').val() != ""){
      coreData.currEle.attr('id', $('#id-name-input').val());
      $('#event-type-id-error').hide();
      $('#save-btn').prop('disabled', false);
      _ele.parent().parent().html('<span class="success">ID added successfully. Please continue building function.</span>\
                                  <p>The ID you added is "<span id="id-val">' + $('#id-name-input').val() + '</span>"</p>');
      clickBindSaveBtn();
    }
  }

  // display modal to add class to element
  function addAClass(){
    utils.resetModal();
    $('#modal').modal('show');
    fileMenu.modalTitle('Add a Class');
    fileMenu.modalBodyTmpl('add-class-tmpl');
    $('#save-btn').unbind( "click" );
    if(coreData.currEle){
      $('#save-btn').on('click', function(){
        coreData.currEle.attr("id", $('#id-name-input').val());
        $('#modal').modal('hide');
      });
    }
    else{
      $('#add-class-error').show();
      $('#save-btn').prop('disabled', true);
      $('#save-btn').on('click', function(){
        console.info('must select and element first');
      });
    }
  }

  // display modal to add id to element
  function addAnId(){
    console.log("awdawd");
    utils.resetModal();
    $('#modal').modal('show');
    fileMenu.modalTitle('Add an ID');
    fileMenu.modalBodyTmpl('add-id-tmpl');
    $('#save-btn').unbind( "click" );
    if(coreData.currEle){
      $('#save-btn').on('click', function(){
        coreData.currEle.attr("id", $('#id-name-input').val());
        $('#modal').modal('hide');
      });
    }
    else{
      $('#add-id-error').show();
      $('#save-btn').prop('disabled', true);
      $('#save-btn').on('click', function(){
        console.info('must select and element first');
      });
    }
  }

  // function to handle adding js
  function attachCustomFunct(){
    var fullFunction = "",
      eventFunction = "",
      functName = $('#funct-name').val(),
      functContent = $('#funct-content').val(),
      functParams = "",
      eventType = $('input[name=event-type]:checked').val();

    // if an event type was selected
    if(eventType){
      $('.funct-param').each(function(){
        // check if field was empty
        var val = $(this).val().trim();
        if(val != ""){
          functParams += $(this).val() + ",";
        }
      });

      // removes last comma
      functParams = functParams.replace(/,\s*$/, "");
      fullFunction = "function " + functName + "(" + functParams + "){<br>"
      + functContent + "<br>}<br>";

      eventFunction += "$('#" + $('#id-val').html() + "').on('" + eventType + "', function(){<br>" + functName + "(); <br>});";

      // add to global PAGE.PAGEJS
      PAGE.PAGEJS += fullFunction + "<br>" + eventFunction;

      // dismiss modal
      $('#modal').modal('hide');
    }
    else{
      console.log('please select a click event type');
      $('#event-type-selection-error').show();
    }
  }

  // shows a modal to add Image URL
  function displayAddURLModal(){
    utils.resetModal();
    coreData.currEle.popover('hide');
    $('#modal').modal('show');
    $("#modal-title").html('Add Image Via URL');
    $("#modal-body").html('<input type="text" class="form-control" id="img-url" placeholder="Enter URL to Image">\
                          <p style="color:red;display:none;" id="img-url-error">Please enter a URL!</p>');
    $('#save-btn').unbind( "click" );
    $('#save-btn').on('click', function(){
      if($('#img-url').val()){
        coreData.currEle.find('img').attr("src", $('#img-url').val());
        coreData.currEle.find('img').css('max-height', '400px');
        coreData.currEle.find('img').css('max-width', '400px');
        $('#modal').modal('hide');
      }
      else{
        $('#img-url-error').show();
      }
    });
  }

  // shows a modal to edit the address of a link
  function showEditLinkModal(){
    utils.resetModal();
    coreData.currEle.popover('hide');
    $('#modal').modal('show');
    $("#modal-title").html('Add Link Address');
    $("#modal-body").html('<b>Text you want the on the hyperlink:</b>\
                          <input type="text" class="form-control" id="link-text" placeholder="Text to display">\
                          <b>To what URL should this link go?</b> \
                          <input type="text" class="form-control" id="link-url" placeholder="Link Address">\
                          <input type="button" class="btn btn-default" value="Test this link" onclick="window.open($(\'#link-url\').val())">\
                          <p style="color:red;display:none;" id="link-url-error">Please enter a URL or link address!</p>');
    $('#save-btn').unbind( "click" );
    $('#save-btn').on('click', function(){
      if($('#link-url').val()){
        coreData.currEle.attr("href", $('#link-url').val());
        if($('#link-text').val()){
          coreData.currEle.html($('#link-text').val());
          $('#modal').modal('hide');
        }
        else{
          coreData.currEle.html($('#link-url').val());
          $('#modal').modal('hide');
        }
      }
      else{
        $('#link-url-error').show();
      }
    });
  }



  // functions
  self.addOption = addOption;
  self.addAnId = addAnId;
  self.addAClass = addAClass;
  self.removeOption = removeOption;
  self.addRadio = addRadio;
  self.addRadioName = addRadioName;
  self.removeRadio = removeRadio;
  self.addCheckbox = addCheckbox;
  self.removeCheckbox = removeCheckbox;
  self.toggleStyle = toggleStyle;
  self.changeEleStyle = changeEleStyle;
  self.changeEleTag = changeEleTag;
  self.addPlaceholderText = addPlaceholderText;

  self.displayAddURLModal = displayAddURLModal;
  self.addFillerTxt = addFillerTxt;
  self.postDragOutElement = postDragOutElement;

  return self;
});