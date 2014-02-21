var rooms = (function(){
  var instance = null;
  
  Rooms.prototype.rooms = {};
  Rooms.prototype.players = {};
  Rooms.prototype.container;
  
  Rooms.prototype.onReset = function onReset(roomid){
    var room = this.rooms[roomid];
    var ches = chess.chesses[room.chessid];
    ches.reset();
  }
  
  Rooms.prototype.onClean = function onClean(roomid){
    var room = this.rooms[roomid];
    var ches = chess.chesses[room.chessid];
    ches.clean();
  }
  
  Rooms.prototype.loadMatch = function loadMatch(e,o,roomid){
		e.preventDefault();
		
		this.rooms[roomid].loadMatch(partidas[o.getAttribute('match')].jugadas);
		return stopEvent(e);
	}
	
  Rooms.prototype.changeOption = function changeOption(r,o,v){
		this.rooms[r].changeOption(o,v);
		document.getElementById('options_'+r).innerHTML = this.rooms[r].htmlTime();
	}
	
  Rooms.prototype.habilitarTiempo = function habilitarTiempo(e,o,room){
		this.rooms[room].habilitarTiempo(e,o);
	}
	
  Rooms.prototype.optionsChange = function optionsChange(e,o,room){
		this.rooms[room].optionsChange(e,o);
	}
	  
  Rooms.prototype.juegaSoli = function juegaSoli(e,o,roomid){
		this.rooms[roomid].juegaSoli(e,o);
	}
	
  Rooms.prototype.start = function start(r){
		this.rooms[r].start();
	}
	
	Rooms.prototype.unirFromList = function unirFromList(e,o,u){
		var roomid = o.parentNode.children[0].innerHTML;
		var c = '', color=o.innerHTML;

		this.rooms[roomid].show();

		if (this.players[roomid] && this.players[roomid][color] && this.players[roomid][color]!=u)
			return;

		if (this.players && this.players[roomid]) {
			
			if (this.players[roomid].BLANCAS==u) {
				c = 'BLANCAS';
			}
			else if (this.players[roomid].NEGRAS==u)
				c = 'NEGRAS';
			if (color == c) {
				socket.emit("unSetColor", u ,roomid, c);
			}
			else {
				if (c) {
					socket.emit("unSetColor", u ,roomid, c);
				}
				socket.emit("setColor", u ,roomid, color);
			}
			return;
		}
		
		socket.emit("setColor", u ,roomid, color);
		
		
	}
	
  Rooms.prototype.setChessId = function setChessId(roomid,chessid){
		this.rooms[roomid].setChessId(chessid);
	}
	
  Rooms.prototype.createLocalRoom = function createLocalRoom(e,o){
		var args = {
			user:manageSessions.get('login'),
			owner:manageSessions.get('login'),
			
		}
		var r=new LocalRoom(args);
		rooms.add(r);
		if (r.owner==manageSessions.get('login'))
			r.show();
		
	}
	
  Rooms.prototype.addToList = function addToList(room){
		var html = '';
		
		html += 	'<div>';
		html += 		'<span chess="'+room.chessid+'">';
		html += 			room.roomid;
		html += 		'</span>';
		html += 		'<span>BLANCAS</span>';
		html += 		'<span id="BLANCAS_'+room.roomid+'">'+room.BLANCAS+'</span>';
		html += 		'<span>NEGRAS</span>';
		html += 		'<span id="NEGRAS_'+room.roomid+'">'+room.NEGRAS+'</span>';
		html += 	'</div>';
		html += 	'<div>';
		html += 		'<span>tiempo</span>';
		html += 		'<span id="options_'+room.roomid+'">'+room.htmlTime()+'</span>';
		html += 	'</div>';
		
		
		var d = document.createElement('DIV');
		d.className='row-room-list';
		d.innerHTML= html;
		var l = document.body.getElementsByClassName('rooms-container')[0];
		l.appendChild(d);
		
		var f = function() { return rooms.unirFromList(arguments[0],this,manageSessions.get('login'))}
		d.children[0].children[1].onclick=f;
		d.children[0].children[3].onclick=f;

	}

  Rooms.prototype.add = function add(room, args){
		this.rooms[room.roomid]=room;
		if (args) {
		}
		return room;
	}
  
	Rooms.prototype.setColorInRoom = function setColorInRoom(user,room,color){
		this.rooms[room].refresh('setColor',{'user':user,'color':color});
    if (!this.players[room])
			this.players[room]={BLANCAS:'',NEGRAS:''};
		this.players[room][color]=user;
    //if (this.rooBLANCAS && this.NEGRAS
	}
  
	Rooms.prototype.setColorInList = function setColorInList(user,room,color){
		var d=document.getElementById(color+'_'+room);
		d.innerHTML=user;
		d=d.previousSibling;
		d.className='disabled';
	}
  
	Rooms.prototype.unSetColorInRoom = function unSetColorInRoom(user,room,color){
		this.rooms[room].refresh('unSetColor',color);
		this.players[room][color]='';
	}
  
	Rooms.prototype.unSetColorInList = function unSetColorInList(user,room,color){
		var d=document.getElementById(color+'_'+room);
		d.innerHTML='';
		d=d.previousSibling;
		d.className='';
		
	}

	Rooms.prototype.getElements = function getElements(e){
		switch(e) {
			case 'BUTTONS':
				return document.querySelectorAll('div.rooms-buttons>button');
			break;
				
		}
		return null;
	}
	
	Rooms.prototype.initListeners = function initListeners(){
		this.listeners={
			'ENTRENAR': function (){ return rooms.createLocalRoom(arguments[0],this)}
		}
		var buttons = this.getElements('BUTTONS');
		for (var i in buttons) {
			switch(buttons[i].value) {
				case 'ENTRENAR': //alert('entrenar'); break;
					buttons[i].onclick = this.listeners[buttons[i].value]
				break;
			
			}
		}
		
	}
	
	Rooms.prototype.init = function init(){
		this.rooms = {};
		this.container = document.getElementsByClassName('rooms-container')[0];
		this.container.innerHTML+='<div class="roomlist"></div>';
		chess.init();
		
	}
  
  function Rooms(){
		this.rooms={};
	}
  
  return instance ? instance : instance = new Rooms();

})()