window.onload = function() {

                            //https for heroku; http for localHost
  var socket = io.connect('https://' + document.domain + ':' + location.port, {transports: ['websocket']});
  var firstConnect = true;
  var myName = "";

  addSubmitButtonListener(socket);

  socket.on('connect', function() {
    socket.emit('connection event');
    console.log("emiting connection event")
  });

  socket.on('incoming message', function(msg, author, avatar){
    if (author == myName){
      addMessageFromSelf(avatar, author, msg);
    } else {
      addMessageFromOtherUser(avatar, author, msg);
    }
      var height =  $( '#messages-div' ).height() + 10;
      $( '#messages-div' ).scrollTop(height);
  })

  socket.on('someone connected', function(displayName, avatar, usersOnlineDisplayNames, usersOnlineAvatars) {
    if (firstConnect){
      myName = displayName;
      firstConnect = false;
      for (var i = 0; i < usersOnlineAvatars.length; i++){
        addUserToOnlineDiv(usersOnlineDisplayNames[i], usersOnlineAvatars[i])
      }
    }
    addUserToOnlineDiv(displayName, avatar)
  }); // end someone connected

  socket.on( 'disconnect event',  function(userWhoLeft) {
    let divToRemove = "." + userWhoLeft + "-user-online-div";
      console.log('disconnection: ' + userWhoLeft + " | divToRemove = " + divToRemove)

    $(divToRemove).remove();
  });

} //end onload

// helper methods
function addSubmitButtonListener(socket){
  $('#myMessage').on('keyup', function (e) {
    var message = $('#myMessage').val()
    if(e.which === 13 && message != ""){
      socket.emit('message', message);
      $('#myMessage').val('')
    }
  });

  $('#sendButton').on('click', function(){
    var message = $('#myMessage').val()
    if (message != ""){
      socket.emit('message', message);
      $('#myMessage').val('')
    }
  })
}

function addMessageFromSelf(avatar, author, msg){
  $("#messages-div").append('<div class = "my-messages">' +
    msg +
  "<img class = 'messages-avatar' src = static/images/jeff" + avatar + ".jpg>" +
  '</div>'
)};

function addMessageFromOtherUser(avatar, author, msg){
  $("#messages-div").append('<div class = "other-messages">' +
  "<img class = 'messages-avatar' src = static/images/jeff" + avatar + ".jpg>" +
  author +
  ": " +
  msg +
  '</div>'
)};

function addUserToOnlineDiv(displayName, avatar){
  $("#online-users-div").append(
    '<div class = "' + displayName + '-user-online-div">' +
    '<img class = "avatar-sidebar-img" src=static/images/jeff' + avatar + ".jpg>" +
    displayName +
    '</div>')
  }