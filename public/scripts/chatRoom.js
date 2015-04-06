//@author: Marcel Bastian
$(document).ready(function() {
	var user, room;
	user = sessionStorage.getItem("user");
	if(!user) {
		user = "John";//TODO !!! DEBUG ONLY!!!
	}
	room = sessionStorage.getItem("room");
	chatSocket = io.connect("http://localhost:3000");
	chatSocket.on('connected', function() {
		chatSocket.emit('newUser', JSON.stringify({ room:room, user:user}));
		$('#onChat').removeClass('hidden');
	});

	chatSocket.on('error',function(evt) {
		evt = JSON.parse(evt);
		$('#onChat').addClass('hidden');
		chatSocket.close();
		$("#onError span").text(evt.type);
		$("#onError").removeClass('hidden');
	});

	chatSocket.on('msg', function(evt) {
		evt = JSON.parse(evt);
		var el = $('<div class="message"><span></span><p></p></div>');
		$("span", el).text(evt.user + ":");
		$("p", el).text(evt.data);
		if(evt.user == user) {
			$(el).addClass('me');
		}
		$('#messages').append(el)
	});

	chatSocket.on('newUser', function(evt) {
		evt = JSON.parse(evt);
		if(evt.user != user) {
			var li = document.createElement('li');
			li.textContent = evt.user;
			li.setAttribute("class", evt.user);
			$("#members").append(li);
		}//Inform about new User
		var el = $('<div class="system"><span>Info:</span><p></p></div>');
		$("p", el).text("New user joined: " + evt.user);
		$('#messages').append(el);
		$('#messages').scrollTop(99999999);
	});

	chatSocket.on('kill', function(evt) {
		evt = JSON.parse(evt);
		$("#members li").remove("." + evt.user);
		var el = $('<div class="system"><span>Info:</span><p></p></div>');
		$("p", el).text("user left: " + evt.user);
		$('#messages').append(el);
	});

	var handleReturnKey = function(e) {
		if(e.charCode == 13 || e.keyCode == 13) {
			e.preventDefault();
			sendMessage();
		}
	};
	var sendMessage = function() {
		// create Message
		chatSocket.emit("msg", JSON.stringify(
			{data: $("#talk").val(), room:room, user:user}));
		$("#talk").val('');
	};
	$("#talk").keypress(handleReturnKey);

	chatSocket.on('close', function() {
		alert("Tschüss");
	});

});
