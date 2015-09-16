/**
 * Created by Clay on 5/15/2015.
 */
//function showMessage(_message, _type, _iconName, _timeout) {
//
//  var iconName = "img/" + _iconName;
//  // create the notification
//  switch (_type) {
//    case "thumb":
//      notification = new NotificationFx({
//        message: '<div class="ns-thumb"><img src="' + iconName + '" height="50" width="50" style="margin:8px;border-radius: 10px;"/></div><div class="ns-content"><p>' + _message + '</p></div>',
//        layout: 'other',
//        effect: 'thumbslider',
//        type: 'notice', // notice, warning, error or success
//        wrapper: document.getElementById('msg-div')
//      });
//      break;
//    case "slidetop":
//      notification = new NotificationFx({
//        message: '<span class="icon"><img src="' + iconName + '" height="50" width="50" style="margin:8px;border-radius: 10px;" /></span><p>' + _message + '</p>',
//        layout: 'bar',
//        effect: 'slidetop',
//        type: 'notice', // notice, warning or error
//        wrapper: document.getElementById('msg-div')
//      });
//      break;
//  }
//
//  // show the notification
//  notification.show();
//  if (_timeout) {
//    setTimeout(function () {
//      notification.dismiss();
//    }, _timeout);
//  }
//}

function showMessage(_message, _type, _timeout){
  var iconName, type;
  switch (_type){
    case "error":
      iconName = "img/error.png";
      type = "error";
      break;
    case "success":
      iconName = "img/success.png";
      type = "success";
      break;
  }
  // create the notification
  var notification = new NotificationFx({
    message: '<div class="ns-thumb"><img src="' + iconName + '" height="50" width="50" style="margin:8px;border-radius: 10px;"/></div><div class="ns-content"><p>' + _message + '</p></div>',
    layout: 'other',
    effect: 'thumbslider',
    type: type, // notice, warning, error or success
    ttl:_timeout,
    wrapper: document.getElementById('msg-div')
  });

  // show the notification
  notification.show();
}
