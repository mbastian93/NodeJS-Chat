$(function() {
	var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
	console.log("user : @userName in room @roomName");
	var chatSocket = new WS("@routes.TextchatApplication.chat(userName, roomName).webSocketURL()");
	chatSocket.onopen = function() {
		console.log("socket opened");
		//init connection		
		chatSocket.send(JSON.stringify({type:"Create or join", data:$("#talk").val(), room:"@roomName", username:"@userName"}));
	};    
	var sendMessage = function() {
		// create Message
		chatSocket.send(JSON.stringify(
				{type:"msg", data: $("#talk").val(), room:"@roomName", username:"@userName", dest: "roomAll"}));
		$("#talk").val('');// empty messagebox
	};

	var receiveEvent = function(event) {
		var evt = JSON.parse(event.data);
		// Handle errors
		if(evt.type == "error") {
			chatSocket.close();
			$("#onError span").text(evt.type);
			$("#onError").show();
			console.log("Error activated");
			return;
		} else {
			$("#onChat").show();
			console.log("Chat activated");
		}	
		switch(evt.type) {
		case "msg" :
			// Create the message element
			var el = $('<div class="message"><span></span><p></p></div>');
			$("span", el).text(evt.username);
			$("p", el).text(evt.data);
			if(evt.username == '@userName') {
				$(el).addClass('me');
			}
			$('#messages').append(el);
			break;
		case "created":
		case "join":
		case "joined":
			// Update the members list
			if(evt.username != "@userName") {
				var li = document.createElement('li');
				li.textContent = evt.username;
				li.setAttribute("class", evt.username);
				$("#members").append(li);
			}
			//Inform about new User
			var el = $('<div class="system"><span></span><p></p></div>');
			$("p", el).text("New user joined: " + evt.username);
			$('#messages').append(el);
			break;
		case "kill":
			//var name =  "\"."+evt.username+\"";
			console.log(name);
			$("#members li").remove("\"." + evt.username + "\"");
			var el = $('<div class="system"><span></span><p></p></div>');
			$("p", el).text("user left: " + evt.username);
			$('#messages').append(el);
			break;
		default:
			break;
		};
	}
	var handleReturnKey = function(e) {
		if(e.charCode == 13 || e.keyCode == 13) {
			e.preventDefault();
			sendMessage();
		}
	};

	$("#talk").keypress(handleReturnKey);
	chatSocket.onmessage = receiveEvent;
	chatSocket.onclose = function() {
		alert("Tschüss");
	};

});
