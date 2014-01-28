var ChatBox = Backbone.Model.extend({
  initialize: function(){
    var regex = new RegExp(/username=([^&]+)/g);
    var url = document.URL;
    this.set({roomname: "",
              roomList: {},
              friends: {},
              messageList: [],
              userName: regex.exec(url)[1]
            });
  },
  submit: function(message){
    // debugger;
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify({username: this.get('userName'),
                            text: message,
                            roomname: this.get('roomname')}),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  getMessage: function(options){
    var data = {order:'-createdAt'};
    var room = this.get('roomname');
    this.get('roomname') && (data.where = {roomname:this.get('roomname')});
    // debugger;
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      //to apply restriction on data received (eg. sort, limit), 
      //pls create an object under data.
      data: data,
      contentType: 'application/json',
      success: options.success,
      error: function (data) {
        console.error('chatterbox: Failed to get new messages. ERR:' + data);
      }
    });
  },
  addFriend: function(friendName){
    this.get('friends')[friendName] = !this.get('friends')[friendName];
  }
});

// TODO: clear out roomList periodically
// $(document).ready(function(){
var ChatBoxView = Backbone.View.extend({
  el: 'body',
  events: {
    'click .user' : "userClickHandler",
    'click .room' : "roomClickHandler",
    'click button#createRoom' : 'roomCreateHandler',
    'click button#submitMessage' : 'submitClickHandler'
  },
  userClickHandler: function(event){
    var friend = $(event.currentTarget).text();
    // this.model.set('',JSON.stringify(!friend));
    this.model.addFriend(friend);
  },
  roomClickHandler: function(event){
    var room = $(event.currentTarget).text();
    $('h3').text("You are in room: " + room);
    this.model.set('roomname', room);
  },
  roomCreateHandler: function(event){
    var room =  $('#newRoomInput').val();
    $('h3').text("You are in room: " + room);
    this.model.set('roomname', room);
  },
  submitClickHandler: function(event){
    var message = $("#userInput").val();
    if(message === "") return;
    this.model.submit(message);
  },
  initialize: function(){
    var options = {
      success:function (data) {
        var model = this.model;
        var messages = data.results
        $('#messages').html("");
        this.displayMessages(messages);
        this.buildRoomList(messages, model.get('roomList'), $('#rooms'));
      }.bind(this),
      failure: function(data){console.log("Failed to get messages")}
            };
    setInterval(this.model.getMessage.bind(this.model,options), 1000);
  },
  displayMessages: function(messages) {
    var context;
    var message_html;
    var $messageBox; 
    var room = this.model.get('roomname');
    var source = $("#message-template").html();
    var template = Handlebars.compile(source);
    for(var i = 0; i < messages.length; i++){
      $messageBox = $('<div id="messageBox"></div>');
      if(messages[i].text && messages[i].text.length > 5000 ||
         (messages[i].roomname !== room && room !== "")){
        continue;
      }
      context = {
        user_name: messages[i].username,
        time: messages[i].updatedAt,
        message: messages[i].text
      };
      message_html = template(context);
      $messageBox.html(message_html);
      if(this.model.get('friends')[messages[i].username]){
        $messageBox.addClass('friend');
      }
      $messageBox.appendTo($('#messages'));
    }
  },
  buildRoomList: function(data, roomListModel, $roomListView){
    _.each(data, function(value){
      if (!roomListModel[value.roomname]){
        roomListModel[value.roomname] = true;
        var $roomnameView = $('<ul class="room"></ul>');
        $roomnameView.text(value.roomname);
        $roomListView.append($roomnameView);
      }
    })
  }
});

$(document).ready(function(){
  var chatBox = new ChatBox();
  var chatBoxView = new ChatBoxView({model:chatBox});
  // $('body').append(chatBoxView.render());
});
