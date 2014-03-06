var rooms = (function(){
  var instance = null;
  
  Rooms.prototype.rooms = {};
  Rooms.prototype.players = {};
  Rooms.prototype.container;
  
	Rooms.prototype.onSolicitudAnular1 = function onSolicitudAnular1(r,c,u){	
		this.rooms[r].onSolicitudAnular1(c,u);
	}

	Rooms.prototype.onAceptarSolicitud = function onAceptarSolicitud(r,c,u){	
		this.rooms[r].onAceptarSolicitud(c,u);
	}

	Rooms.prototype.onLeftPanel = function onLeftPanel(e,o,r){	
		if (this.rooms[r] && this.rooms[r].onLeftPanel &&  this.rooms[r].onLeftPanel(e,o)) {
			return stopEvent(e);
		}
		return stopEvent(e);
		

	}

	Rooms.prototype.onApertura = function onApertura(e,o,r){
		this.rooms[r].onApertura(o.id);
		return stopEvent(e);
	}
	
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
	
	Rooms.prototype.onSolapaClick = function onSolapaClick(e,o){
		this.activarSolapa(o.innerHTML);
	}
	
	Rooms.prototype.activarSolapa = function activarSolapa(roomid){
		if (this.solapaActiva) {
			if (roomid!=this.solapaActiva) {
				this.rooms[this.solapaActiva].hide();
				o=this.getElements('SOLAPA',this.solapaActiva);
				o.setAttribute('state',0);
			}
			else {
				return;
			}
			
		}
		
		this.solapaActiva = roomid;
		this.rooms[this.solapaActiva].show();
		o=this.getElements('SOLAPA',roomid);
		o.setAttribute('state',1);
		
	}
	
	Rooms.prototype.addSolapa = function addSolapa(roomid){
		var div = document.createElement('div');
		var html = '';
		html += '<div class="solapa" id="'+roomid+'" onclick="return rooms.onSolapaClick(event,this)">';
		html += roomid;
		html += '</div>';
		div.innerHTML = html;
		this.getElements('SOLAPAS')[0].appendChild(div.children[0]);
		this.solapas[roomid]=1;
	}
	
	Rooms.prototype.unirFromList = function unirFromList(e,o,u){
		var roomid = o.parentNode.children[0].innerHTML;
		var c = '', color=o.innerHTML;

		this.rooms[roomid].show();
		if (!this.solapas[roomid]) {
			this.addSolapa(roomid);
		}
		this.activarSolapa(roomid);
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
	
  Rooms.prototype.moveElementTo = function moveElementTo(x,y){
		ISgControl.prototype.moveElementTo.call(this,x,y);
	}
  Rooms.prototype.createLocalRoom = function createLocalRoom(e,o){
		var args = {
			user:manageSessions.get('login'),
			owner:manageSessions.get('login'),
			handler:this
		}
		var r=new LocalRoom(args);
		rooms.add(r);
		if (r.owner==manageSessions.get('login'))
			r.show();
		if (!this.solapas[r.roomid]) {
			this.addSolapa(r.roomid);
		}
		this.activarSolapa(r.roomid);
		
		macro(2,r.roomid,'APERTURA');
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
		this.element = l;
		
		// var args = {eargs:{}, oargs:{}, common:{}};
		// args.eargs.parentNode = this.element;
		// args.oargs.handler = this;
		// args.common.id = 'rooms_flier';
		// this.flierControl = new FlierControl(args);
		
		
		var f = function() { 
			return rooms.unirFromList(arguments[0],arguments[1],manageSessions.get('login'))
		}
		domHelper.mapToElement(d.children[0].children[1],{onclick:f});
		domHelper.mapToElement(d.children[0].children[3],{onclick:f});

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

	Rooms.prototype.getElement = function getElement(e,o){
		switch(e) {
			case 'LISTENER':
				return document.querySelector('div.rooms-buttons>button[value="'+o+'"]');
			break;
		}
	}
	
	Rooms.prototype.getElements = function getElements(e,o){
		switch(e) {
			case 'BUTTONS':
				return document.querySelectorAll('div.rooms-buttons>button');
			break;
			case 'SOLAPAS':
				return document.querySelectorAll('div.solapas');
			break;
			case 'SOLAPA':
				return document.querySelectorAll('div.solapas>div.solapa#'+o)[0];
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
	}
  
  function Rooms(){
		this.rooms={};
		this.solapas={};
		//this.solapasContainer
	}
  
  return instance ? instance : instance = new Rooms();

})()