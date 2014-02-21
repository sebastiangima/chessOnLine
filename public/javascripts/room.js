function IRoom(){}

function habilitarTiempo(e,o) {
  e.preventDefault();
	var tags = o.parentNode.getElementsByTagName('input'); 
	for (var i=1; i<tags.length; ++i) {
		if (o.checked) 
			tags[i].removeAttribute('disabled'); 
		else 
			tags[i].setAttribute('disabled',true)
	}
	return stopEvent(e);
}

IRoom.prototype.editar = function editar(){
  this.clean();
  chess.chesses[this.chessid].editing=true;
 
  this.editPanel.setAttribute('state',1);
}

IRoom.prototype.clean = function clean(){
	socket.emit("clean", this.roomid);
	chess.chesses[this.chessid].clean();
	var d = this.element.querySelectorAll("input[name='jugadores']")[0]
	if (d.checked) {
	}

  
}

IRoom.prototype.reset = function reset(){
	socket.emit("reset", this.roomid);
  chess.chesses[this.chessid].reset();
}

IRoom.prototype.synchro = function synchro(){
	for (var i=0; i<this.tableritos.length; ++i) {
		this.tableritos[i].synchro();
	}
}

// Room.prototype.move = function start(from,to,bulean){
	// chess.chesses[this.chessid].move(from,to,bulean)
// }


// Room.prototype.jaque = function jaque(){
	// chess.chesses[this.chessid].jaque()
// }

IRoom.prototype.habilitarTiempo = function habilitarTiempo(e,o){
  e.preventDefault();
	var tags = o.parentNode.getElementsByTagName('input'); 
	for (var i=1; i<tags.length; ++i) {
		if (o.checked) 
			tags[i].removeAttribute('disabled'); 
		else 
			tags[i].setAttribute('disabled',true)
	}
	this[o.name]=o.checked?1:0;
	socket.emit("changeOptions", this.roomid,o.name,this[o.name]);
}

IRoom.prototype.htmlTime = function htmlTime(){
	if (this.tiempo==0)
		return 'SIN TIEMPO';
	return this.ti+ ' / '+this.ixj + '       MAX '+this.mxp;
}

IRoom.prototype.changeOption = function changeOption(o,v){
	this[o]=v;
	$('input[name="'+o+'"]')[0].value = v;
}

IRoom.prototype.optionsChange = function optionsChange(e,o){
	this[o.name]=o.value;
	socket.emit("changeOptions", this.roomid,o.name,o.value);
}

IRoom.prototype.invertir = function invertir(){
	chess.chesses[this.chessid].invertir();
}

IRoom.prototype.onPartidas = function onPartidas(e){
	var d = document.getElementById('partidas_'+this.roomid);
	d.setAttribute('state','1');
}

IRoom.prototype.loadMatch= function loadMatch(jugadas){
	var d = document.getElementById('partidas_'+this.roomid);
	d.setAttribute('state','0');
	chess.startAnimation(this.roomid,this.chessid,'one',jugadas);
	
}

IRoom.prototype.initPartidas = function initPartidas(e){
	var b, n, jugadores;
	var html = '', onclick = ' onclick=rooms.loadMatch(event,this,"'+this.roomid+'") ';
	var div = document.createElement('DIV');
	html += '<div class="incenter partidas" state="0" id="partidas_'+this.roomid+'" >';
	for (var i in partidas) {
		jugadores = i.split('-');
		b = jugadores[0];
		n = jugadores[1];
		r = partidas[i].resultado;
		d = partidas[i].descripcion;
		html += 	'<div>'
		html += 		'<div match="'+b+'-'+n+'" class="like-button" id="cargar_"'+this.roomid+'"'+onclick+'>CARGAR</div>';
		html += 		'<div class="jblancas">'+b;
		html += 		'</div>';
		html += 		'<div class="jnegras">'+n;
		html += 		'</div>';	
		html += 		'<div class="jresultado">'+r;
		html += 		'</div>';	
		html += 		'<div class="jdescripcion">'+d;
		html += 		'</div>';	
	}
	html += 	'</div>';
	html += '</div>';
	
	div.innerHTML = html;
	this.element.appendChild(div.children[0]);
}

IRoom.prototype.onSalir = function onSalir(e,o){
  var user = manageSessions.get('login');
  var color='';
  if (this.BLANCAS==user) {
    color='BLANCAS';
  }
  else if (this.NEGRAS==user) {
    color='NEGRAS';
  }
  if (color)
    socket.emit("unSetColor", user,this.roomid,color);

  this.element.style.display='none';
}

IRoom.prototype.onCommand = function onCommand(e,o){
	e.preventDefault();
	switch(o.innerHTML) {
		case 'BLANCAS': 
		case 'NEGRAS':
			
			if (this[o.innerHTML] == manageSessions.get("login")) {
				socket.emit("unSetColor", manageSessions.get("login"),this.roomid,o.innerHTML);
			}
			else {
				if (o.innerHTML=='BLANCAS') {
					if (this.NEGRAS==manageSessions.get("login")) {
						socket.emit("unSetColor", manageSessions.get("login"),this.roomid,'NEGRAS');
					}
				}
				else {
					if (this.BLANCAS==manageSessions.get("login")) {
						socket.emit("unSetColor", manageSessions.get("login"),this.roomid,'BLANCAS');
					}				
				}
				socket.emit("setColor", manageSessions.get("login"),this.roomid,o.innerHTML);
			}
			return stopEvent(e);
		break;
    case 'COMENZAR':
			socket.emit("comenzar", this.roomid);
			this.start();
			//chess.acomodar(this.chessid);
		break;
    case 'PARTIDAS':
      this.onPartidas(e);
    break;
    case 'SALIR':
      this.onSalir(e);
    break;
    case 'SINCRONIZAR':
      this.synchro();
    break;
    case 'EDITAR':
      this.editar();
    break;
    case 'RESET':
      this.reset();
    break;
    case 'INVERTIR':
      this.invertir();
    break;
    case 'TABLERITO':
      this.addTablerito();
    break;
	}
	return stopEvent(e);

}

IRoom.prototype.start = function start(){
	chess.acomodar(this.chessid,this.BLANCAS,this.NEGRAS);
}

IRoom.prototype.refresh = function refresh(msg,args){
	switch(msg) {
		case 'unSetColor':
      args.user=''; 
		case 'setColor':
      this[msg](args); 
    break;
	}
}

IRoom.prototype.unSetColor = function unSetColor(color){
	this.setColor({'color': color, user: ''});
}

IRoom.prototype.setColor = function setColor(args){
	var span = $('SPAN.'+args.color,this.element)[0];
	span.innerHTML = args.user;
	this[args.color]=args.user;
	var btn = this.element.getElementsByClassName('empezar')[0];
	var btn2 = this.element.getElementsByClassName('salir')[0];
	if (this.BLANCAS && this.NEGRAS) {
		btn.removeAttribute('disabled')
		btn2.setAttribute('disabled',true);
	}
	else {
		btn.setAttribute('disabled',true);
		btn2.removeAttribute('disabled');
	}
}

IRoom.prototype.initEditPanel = function initEditPanel(){
  var html = '';
  this.editPanel = document.createElement('div');
  this.editPanel.id = this.roomid+'_editpanel';
  this.editPanel.className = 'editpanel';
  html += '<div class="selected">';
  html += 	'<img value="6" src="images/reyb.png" height="100%" />';
  html += '</div>';
  html += '<div class="blancas">';
  html += 	'<img value="1" src="images/peonb.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="2" src="images/caballob.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="3" src="images/alfilb.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="4" src="images/torreb.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="5" src="images/reinab.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="6" src="images/reyb.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += '</div>';
  html += '<div class="negras">';
  html += 	'<img value="-1" src="images/peonn.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="-2" src="images/caballon.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="-3" src="images/alfiln.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="-4" src="images/torren.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="-5" src="images/reinan.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += 	'<img value="-6" src="images/reyn.png" onclick="chess.onEditPanel(event,this,\''+this.chessid+'\')"  />';
  html += '</div>';
  this.editPanel.innerHTML=html;
  this.element.appendChild(this.editPanel);
  
}

IRoom.prototype.initGame = function initGame(){
	var this_=this;
	var html='';
	html += '<div class="content">';
	html += 	'<div class=	"content-block">';
	html += 		'<button class="btn btn-block btn-primary normal150 unir arriba">BLANCAS</button><span id="turno_'+this.roomid+'_BLNCAS">-></span><span class="BLANCAS"></span>';
	html += 		'<button class="btn btn-block btn-primary normal150 unir abajo">NEGRAS</button><span id="turno_'+this.roomid+'_BLNCAS">-></span><span class="NEGRAS"></span>';
	html += 	'</div>';
	html += '</div>';
	var div = document.createElement('DIV');
	div.innerHTML=html;
	
	this.element.appendChild(div.children[0]);
}

IRoom.prototype.initPanel = function initPanel(){
	var html = '';
	var onchange = this.owner == manageSessions.get('login') ? ' onchange="rooms.optionsChange(event,this,'+this.roomid+')" ' : ' ';
	var checkchange =  this.owner == manageSessions.get('login') ? ' onchange="rooms.habilitarTiempo(event,this,\''+this.roomid+'\')" ' : ' ';
	var checkchange2 =  this.owner == manageSessions.get('login') ? ' onchange="rooms.juegaSoli(event,this,\''+this.roomid+'\')" ' : ' ';
	html += '<div class="left">';
	html += 	'<div class="content-left	" >';
	html += 		'<div class=	"content-block">';
	html += 			'<input style="margin:0px 20px;" name="tiempo" type="checkbox" '+checkchange+'	/>';
	html += 			'<span>Tiempo</span>';
	html += 			'<input style="margin:0px 20px;" name="jugadores" type="checkbox" '+checkchange2+'	/>';
	html += 			'<span>solo</span>';
	html += 			'<br />';
				
	html += 			'<input type="text" disabled="true" '+onchange+'class="room-panel" name="ti" defaultValue="20" />'
	html += 			'<span style="float:left; margin-left:3px">inicial (m)   </span>';
	html += 			'<input type="text" disabled="true" '+onchange+'class="room-panel" name="ixj" defaultValue="10" />'
	html += 			'<span style="float:left; margin-left:3px">incremento (s)</span>';
	html += 			'<input type="text" disabled="true" '+onchange+'class="room-panel" name="mxp" defaultValue="10" />'
	html += 			'<span style="float:left; margin-left:3px">maximo (m)    </span>';
  html += 			'<br/>';
  html += 			'<br/>';
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:290px" class="btn btn-block btn-primary normal150 cargar">EDITAR</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:250px" class="btn btn-block btn-primary normal150 cargar">RESET</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:210px" class="btn btn-block btn-primary normal150 cargar">INVERTIR</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:170px" class="btn btn-block btn-primary normal150 cargar">SINCRONIZAR</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:130px" class="btn btn-block btn-primary normal150 cargar">TABLERITO</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:90px" class="btn btn-block btn-primary normal150 cargar">PARTIDAS</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:50px" class="btn btn-block btn-primary normal150 empezar">COMENZAR</button>'; 
  html +=       '<div class="jugadas" id="jugadas_'+this.roomid+'">';
  html +=         '<div class="jugada">N</div>';
  html +=         '<div class="jugada">blanco</div>';
  html +=         '<div class="jugada">negro</div>';
  html +=       '</div>';
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:10px" class="btn btn-block btn-primary normal150 salir">SALIR</button>'; 
  html += 		'</div>';
	html += 	'</div>';
	html += '</div>';  
  var div = document.createElement('DIV');
  div.innerHTML=html;
 
	this.element.appendChild(div.children[0]);
  
  // var btns = this.element.getElementsByTagName('button');
  // for (var i=0; i<btns.lwength; ++i) {
    // btns[i].onclick=function(){
      // this_.onCommand(arguments[0],this);
    // }
  // } 
  
}

IRoom.prototype.setChessId = function setChessId(chessid){
	this.chessid=chessid;
	for (var i=0; i<this.tableritos.length; ++i) {
		this.tableritos[i].setChessId(chessid);
	}
}

IRoom.prototype.show = function show(){
	//chess.init({parentNode:this.element});	
	this.element.style.display='block';
	
	if (!this.innited) {
		if (manageSessions.get('login')==this.owner) {
			this.chessid = 'chess_'+guid.toString();
			socket.emit("setChessId", this.roomid, this.chessid);
		}
		// else
		chess.add(new OneChess({
			eargs:{
				parentNode: this.element
			},
			oargs:{
				chessid: this.chessid,
				roomid: this.roomid
			},
			common:{
				id: this.rooomid+'_chess'
			}
		}))
	}
	
	this.innited = true;
}

IRoom.prototype.addTablerito = function addTablerito(){
	this.tableritos.push(new Tablerito({
		eargs:{
			parentNode: this.element.getElementsByClassName('tableritos')[0]
		},
		oargs:{
			parentChess: this.chessid,
			chessid: this.chessid+'_'+this.tableritos.length,
			roomid: this.roomid+'_'+this.tableritos.length,
			num:this.tableritos.length
		},
		common:{
			id: this.rooomid+'_chess_'+this.tableritos.length
		}
	}))
	
	chess.add(this.tableritos[this.tableritos.length-1]);
	
}

IRoom.prototype.init = function init(eargs,oargs){
	eargs = eargs || {};
	
	eargs.className = 'room';
	this.innited = false;
	
  var this_=this;

	this.tableritos=[];
	
	eargs.parentNode = document.getElementsByClassName('room-container')[0];
	
	this.element = sgCreateNode('DIV', eargs);
	
	this.element.name='nn';
  
	this.element.onclick = function() {
    if (arguments[0].target != this_.element && arguments[0].target.onchange===null) {
      arguments[0].target.click();
      if (arguments[0].stopPropagation)
        arguments[0].stopPropagation();
       arguments[0].cancelBubble=true;
      return false;
    }
    else {
      $(".rooms-container")[0].style.zIndex=0;
      $(".room-container")[0].style.zIndex=1;
      return true;
    }
	}
	for (var i in oargs) {
		this[i]=oargs[i];
	}
  for (var i in eargs) {
		if (eargs[i] instanceof Function) {
		}
		else {
			this[i]=eargs[i];
		}
	}

	// var dd = document.createElement('div');
	// this.element.appendChild(dd);
	// dd.innerHTML='<div class="arriba">BLANCAS: <span id="blancas"></span></DIV><DIV class="abajo">NEGRAS: <span id="negras"></span></DIV><div class="jugadas"><div></div><div></div><div></div></div>';
	
	var dt = document.createElement('DIV');
	dt.className='tableritos';
	this.element.appendChild(dt);
	this.initPanel();
	this.initGame();
	this.initPartidas();
	this.initEditPanel();
	var d = document.createElement('DIV');
	d.className='btn-comenzar';
	d.innerHTML='COMENZAR';
	this.element.appendChild(d);
	var btns = this.element.getElementsByTagName('button');
	for (var i=0; i<btns.length; ++i) {
		btns[i].onclick = function() {
			return this_.onCommand(arguments[0],this);
		}
	}

}

function Room(){
	this.init(arguments[0]);
}

Room.prototype = new IRoom();

