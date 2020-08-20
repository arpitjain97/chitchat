$(function () {
    var socket = io();
    var receiver;
    var sender;

    $('.chatwindow').hide();
    $('.onlineUsers').hide();
    $('.sendmessage').hide();
    $('.welcome').hide();
    $(".onlineUsers ul").on("click","li",function(e){
      $('.chatwindow').show();
      $('.sendmessage').show();
      $('.welcome').hide();
        receiver =e.target.textContent;
        var curuser = receiver;
        $('.recname').html('<h3>'+curuser + '</h3>')
        socket.emit("prevchat", {sender:sender, receiver: receiver});
      });
      
      $("#auth").submit(function(e){
      e.preventDefault();
      audio.play();
      sender = $("#name").val();
      if(sender.trim() ===''){
          alert("Please Enter Valid name");
          $("#name").val('');
      }
      else{
      socket.emit('new user',$("#name").val(), function(data){});
      $('.welcome').show();
      var welcome = '<p>Welcome </p>'+'<p>'+sender +'!</p>'+' Chat to Online Friends. 😍 ';
      $('.welcome').html(welcome);
      $('.onlineUsers').show();
      $("#name").val('');
      $("#auth").hide();
  }
    });
      
    
     $('#chatbox').submit(function(e) {
       e.preventDefault(); 
        
       socket.emit('chat message', {msg:$('#m').val(), sender: sender, receiver: receiver});
       //alert(sender + $('#m').val() + receiver );
       $('#m').val('');
       
     });
    
    socket.on('online users',function(data){
     var html ='';
    for (var key in data){
      if(key === sender){
        continue;
      }
    html += '<li><button>'+key+'</button></li>'
    }
    $("#users").html(html);
    });
     
    socket.on('currchat', function(Sender,receiver,data){
      var list = document.getElementById("messages");
      while (list.hasChildNodes()) {
       list.removeChild(list.firstChild);
      }
      for(var i=0; i<data.length; i++) {
        if ((data[i].A === Sender && data[i].B === receiver) || (data[i].B === Sender && data[i].A === receiver)){
          if(sender === data[i].A){
            $('#messages').append('<li style = "float: right"  >'+ data[i].msg+'</li>');
          }
          else{$('#messages').append('<li style = "float: left"  >' + data[i].msg+'</li>');
      }
      $('#messages').append('<br>');
      $('#messages').append('<br>');
      $('#messages').append('<br>');
            
          
        
      }}
    })
   
     socket.on('new message', function(data,Sender,Receiver){
      
      if ((sender === Sender && receiver === Receiver) || (sender === Receiver && receiver === Sender)){
        if ((data.A === Sender && data.B === Receiver) || (data.B === Sender && data.A === Receiver)){
          
          if(sender === data.A){
            $('#messages').append('<li style = "float: right" >' +  data.msg+'</li>');
          }else{
            $('#messages').append('<li style = "float: left" >' + data.msg+'</li>');
          }
           $('#messages').append('<br>');
          $('#messages').append('<br>'); 
          
        
      }
     
      }
       
    });
  });