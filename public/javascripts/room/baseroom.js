function IBaseRoom(){}

IBaseRoom.prototype.analizerEnabled = false;
IBaseRoom.prototype.save = function save(){
	var ches = chess.chesses[this.chessid];
	var s='';
	for (var i=0; i<ches.jugadas.length; ++i) {
		var jugada = ches.jugadas[i];
		jugada = jugada.replace(/R/g,'K').replace(/D/g,'Q').replace(/T/g,'R').replace(/A/g,'B').replace(/C/g,'N');
		if (i%2==0) {
			s+=Math.floor(i/2)+1;
			s+='. '+jugada;
		}
		else {
			s+=' '+jugada+'\r\n';
		}
	}
	var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(s));
    pom.setAttribute('download', 'PARTIDA SALVADA.pgn');
    pom.click();
		
	// var uriContent = "data:application/octet-stream," + encodeURIComponent(s);
	// window.open(uriContent,'PARTIDA');
}

IBaseRoom.prototype.setTurno = function setTurno(c,u){	
	if (c == this.chessid) {
		//var ches
		var btn = this.getElement('VOLVER 1');
		if (u==manageSessions.get('login')) {
			btn.setAttribute('disabled','disabled');
		}
		else
			btn.removeAttribute('disabled');
	}
}

IBaseRoom.prototype.onAceptarSolicitud = function onAceptarSolicitud(c){	
	var ches=chess.chesses[this.chessid];
	ches.borrar=true;
	ches.keyDown({keyCode:37});
	// if (this.turno=='blancas') 
		// this.setTurno('negras');
	// else
		// this.setTurno('blancas');
	
		
	
}

IBaseRoom.prototype.onSolicitudAnular1 = function onSolicitudAnular1(c){	
	if (confirm('Petición para anular movimiento')) {
		socket.emit("aceptarSolicitud",this.roomid,this.chessid)
		this.onAceptarSolicitud(c);
	}
}

IBaseRoom.prototype.anular1 = function anular1(e,o){
	var ches = chess.chesses[this.chessid];
	var color;
	if (ches.tipoJuego=='1x2') {
		if (ches.user == ches.BLANCAS) {
			color = 'NEGRAS';
		}
		else {
			color = 'BLANCAS';
		}
		
		socket.emit("solicitudAnular1", this.roomid, this.chessid, ches[color]);
	}
}

IBaseRoom.prototype.onLeftPanel = function onLeftPanel(e,o){
	var div = this.getElement('LEFT_PANEL');
	var state = 1-(+div.getAttribute('state'));
	div.setAttribute('state',state);
}

IBaseRoom.prototype.getElement = function getElement(e){
	switch(e){
		case 'VOLVER 1': 
			var d=this.element.querySelectorAll('button'); 
			for (var i=0; i<d.length; ++i)
				if (d[i].innerHTML==e)
					return d[i];
		break;
		case 'LEFT_PANEL': return this.element.querySelector('div.left'); break;
		case 'APERTURA': return this.element.querySelector('div.apertura-container'); break;
		case 'APERTURAS': return this.element.querySelector('div.aperturas-container'); break;
	}
}

IBaseRoom.prototype.synchro = function synchro(){
	for (var i=0; i<this.tableritos.length; ++i) {
		this.tableritos[i].synchro();
	}
}

IBaseRoom.prototype.onApertura = function onApertura(id){
	aperturas.select(id,this.roomid,this.chessid);
}

IBaseRoom.prototype.aperturas = function aperturas(){
	var d = this.element.querySelectorAll('div.aperturas-container')[0];
	if (d.style.display && d.style.display=='block')
		d.style.display='none';
	else
		d.style.display='block';
}

IBaseRoom.prototype.hide = function hide(){
	this.element.style.display='none';
}

IBaseRoom.prototype.juegaSoli = function juegaSoli(e,o){
  e.preventDefault();
	chess.chesses[this.chessid].juegaSoli(o.checked);


	var d = this.element.querySelectorAll('div.jugadas')[0]; 
  if (o.checked) {
     d.style.zIndex=-1
  }
  else
    d.style.zIndex=1
  
}

IBaseRoom.prototype.editar = function editar(){
  this.clean();
	chess.chesses[this.chessid].setEditMode(true);
  this.editPanel.setAttribute('state',1);
  
  var d=this.element.querySelectorAll('div.container.chess')[0];
  d.getClientsRect();
  console.log(d);
}

IBaseRoom.prototype.clean = function clean(){
	socket.emit("clean", this.roomid);
	chess.chesses[this.chessid].clean();
	var d = this.element.querySelectorAll("input[name='jugadores']")[0]
	
}

IBaseRoom.prototype.reset = function reset(){
	socket.emit("reset", this.roomid);
  chess.chesses[this.chessid].reset();
}

IBaseRoom.prototype.htmlTime = function htmlTime(){
	if (this.tiempo==0)
		return 'SIN TIEMPO';
	return this.ti+ ' / '+this.ixj + '       MAX '+this.mxp;
}

IBaseRoom.prototype.changeOption = function changeOption(o,v){
	this[o]=v;
	$('input[name="'+o+'"]')[0].value = v;
}

IBaseRoom.prototype.optionsChange = function optionsChange(e,o){
	this[o.name]=o.value;
	socket.emit("changeOptions", this.roomid,o.name,o.value);
}

IBaseRoom.prototype.redo = function redo(){
	roomid,chessid,mode,jugadas
}

IBaseRoom.prototype.invertir = function invertir(){
	if (this.chess) this.chess.invertir()
	else chess.chesses[this.chessid].invertir();
}

IBaseRoom.prototype.onPartidas = function onPartidas(e){
	var d = document.getElementById('partidas_'+this.roomid);
	d.setAttribute('state','1');
}

IBaseRoom.prototype.loadMatch= function loadMatch(jugadas){
	var d = document.getElementById('partidas_'+this.roomid);
	d.setAttribute('state','0');
	chess.startAnimation(this.roomid,this.chessid,'one',jugadas);
	

}

IBaseRoom.prototype.initAperturas = function initAperturas(e){
	var html = '';
	html += '<div class="aperturas-container">'
	html += 	'<ul>Defensa Siciliana'
	html += 		'<li id="DSVDN" onclick="rooms.onApertura(event,this,\''+this.roomid+'\')">Variante Dragón Normal'
	html += 		'</li>'
	html += 	'</ul>'
	html += 	'<div class="apertura-container">'
	html += 	'</div>'
	html += '</div>'
	var d=document.createElement('div');
	d.innerHTML=html;
	this.element.appendChild(d.children[0]);
}

IBaseRoom.prototype.initPartidas = function initPartidas(e){
	var b, n, jugadores;
	var html = '', onclick = ' onclick=rooms.loadMatch(event,this,"'+this.roomid+'") ';
	var div = document.createElement('DIV');
//	html += '<div class="incenter partidas" state="0" id="partidas_'+this.roomid+'" >';
	
	// args={eargs:{className:'incenter partidas', state:0, id:'partidas_'+this.roomid,parentNode:this.element},
				// oargs:{handler:this.handler?this.handler:this},
				// common:{}
			// }
	
	
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
	//html += '</div>';
	
	var args={eargs:{width:'50%', className:'incenter partidas', state:0,parentNode:this.element,innerHTML:html},
				oargs:{owner:this},
				common:{id:'partidas_'+this.roomid}
			}
	
	this.partidasGrabadas = new Panel(args);
	
	// div.innerHTML = html;
	// this.element.appendChild(div.children[0]);
}

IBaseRoom.prototype.onSalir = function onSalir(e,o){
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

IBaseRoom.prototype.onCommand = function onCommand(e,o){
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
    case 'SAVE':
      this.save();
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
    case 'VOLVER 1':
      this.anular1();
    break;
    case 'APERTURAS':
      this.aperturas();
    break;
    case 'TABLERITO':
      this.addTablerito();
    break;
	}
	return stopEvent(e);

}

IBaseRoom.prototype.start = function start(){
	return chess.acomodar(this.chessid,this.BLANCAS,this.NEGRAS);
}

IBaseRoom.prototype.refresh = function refresh(msg,args){
	switch(msg) {
		case 'unSetColor':
      args.user=''; 
		case 'setColor':
      this[msg](args); 
    break;
	}
}

IBaseRoom.prototype.unSetColor = function unSetColor(color){
	this.setColor({'color': color, user: ''});
}

IBaseRoom.prototype.setColor = function setColor(args){
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

IBaseRoom.prototype.initEditPanel = function initEditPanel(){
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

IBaseRoom.prototype.initGame = function initGame(){
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

IBaseRoom.prototype.initPanelJugadas = function initPanelJugadas(){
return;
	var html='';
	// var d=document.createElement('div');
	//html += '<div class="jugadas" id="jugadas_'+this.roomid+'">';
  html +=   '<div class="jugada">N</div>';
  html +=   '<div class="jugada">blanco</div>';
  html +=   '<div class="jugada">negro</div>';
//  html += '</div>';
	// d.innerHTML=html;
	// this.element.appendChild(d.children[0]);

	var args = {
		eargs:{parentNode:this.element,className:'jugadas',innerHTML:html},
		oargs:{owner:this,flierControl:true},
		common:{id:'Panel_jugadas_'+this.roomid}
	}
	this.panelJugadas = new Panel(args);
	// var args = {eargs:{}, oargs:{}, common:{}};
	// args.eargs.parentNode = this.element;
	// args.oargs.handler = this;
	// args.common.id = this.roomid+'_'+guid+'_flier';
	// this.flierControl = new FlierControl(args);	
}

IBaseRoom.prototype.initPanel = function initPanel(){
	var html = '';
	var onchange = this.owner == manageSessions.get('login') ? ' onchange="rooms.optionsChange(event,this,'+this.roomid+')" ' : ' ';
	var checkchange =  this.owner == manageSessions.get('login') ? ' onchange="rooms.habilitarTiempo(event,this,\''+this.roomid+'\')" ' : ' ';
	var checkchange2 =  this.owner == manageSessions.get('login') ? ' onchange="rooms.juegaSoli(event,this,\''+this.roomid+'\')" ' : ' ';
	
	html += '<div class="left" state="1" onclick="return rooms.onLeftPanel(event,this,\''+this.roomid+'\')">';
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
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:410px" class="btn btn-block btn-primary normal150 cargar">SAVE</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:370px" class="btn btn-block btn-primary normal150 cargar">VOLVER 1</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:330px" class="btn btn-block btn-primary normal150 cargar">APERTURAS</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:290px" class="btn btn-block btn-primary normal150 cargar">EDITAR</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:250px" class="btn btn-block btn-primary normal150 cargar">RESET</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:210px" class="btn btn-block btn-primary normal150 cargar">INVERTIR</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:170px" class="btn btn-block btn-primary normal150 cargar">SINCRONIZAR</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:130px" class="btn btn-block btn-primary normal150 cargar">TABLERITO</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:90px" class="btn btn-block btn-primary normal150 cargar">PARTIDAS</button>'; 
  html += 			'<button room="'+this.roomid+'" style="left:20px; position:absolute; bottom:50px" class="btn btn-block btn-primary normal150 empezar">COMENZAR</button>'; 
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

IBaseRoom.prototype.setChessId = function setChessId(chessid){
	this.chessid=chessid;
	for (var i=0; i<this.tableritos.length; ++i) {
		this.tableritos[i].setChessId(chessid);
	}
}

IBaseRoom.prototype.show = function show(){
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

IBaseRoom.prototype.addTablerito = function addTablerito(){
	this.tableritos.push(new Tablerito({
		eargs:{
			parentNode: this.element.getElementsByClassName('tableritos')[0]
		},
		oargs:{
			parentChess: this.chessid,
			chessid: this.chessid+'_'+this.tableritos.length,
			handler:this,
			roomid: this.roomid+'_'+this.tableritos.length,
			num:this.tableritos.length
		},
		common:{
			id: this.rooomid+'_chess_'+this.tableritos.length
		}
	}))
	
	chess.add(this.tableritos[this.tableritos.length-1]);
	
}

IBaseRoom.prototype.init = function init(eargs,oargs){
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
      var target=arguments[0].target;
      cancelEvent(arguments[0]);
      if (target) target.click();
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
	this.initGame();
	this.initPanel();
	this.initPanelJugadas();
	this.initPartidas();
	this.initEditPanel();
	this.initAperturas();
	var d = document.createElement('DIV');
	d.className='btn-comenzar';
	d.innerHTML='COMENZAR';
	this.element.appendChild(d);
	var btns = this.element.getElementsByTagName('button');
	for (var i=0; i<btns.length; ++i) {
		domHelper.mapToElement(btns[i],
		{onclick:function() {
			return this_.onCommand(arguments[0],arguments[1])
			}
		})
	}

}

function BaseRoom(){
	this.init(arguments[0]);
}

BaseRoom.prototype = new IBaseRoom();

