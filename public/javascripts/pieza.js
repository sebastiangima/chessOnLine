function sgCreateNode(tagName, properties){
	if (!tagName) tagName = 'DIV'
	var d = document.createElement(tagName);
	
	for (var i in properties) {
		switch (i) {
			case 'name':
			case 'className':
			case 'id':
				d[i] = properties[i];
			break;
			case 'parentNode':
				properties[i].appendChild(d);
			break;
			case 'pcolor':
			case 'fila':
			case 'orientacion':
			case 'columna':
			case 'state':
				d.setAttribute(i,properties[i]);
			break;
			case 'top': 
			case 'left':
				d.style[i]=properties[i];
			break;
			case 'src':
				var img = sgCreateNode('IMG',{parentNode:d});
				img.src = properties[i];
			
			break;
		}
	}
	return d;
}
function Pieza(){}


Pieza.prototype.setState = function setState(state){
	if (state.state==0) 
		this.capturar();
	else {
		if (this.state==0) {
			this.state=1;
			this.element.setAttribute('state',1);
		}
		this.remoteMove([state.row,state.col]);
	}
	
}

Pieza.prototype.invertir = function invertir(){
	this.orientacion*=-1;
	if (this.orientacion==1) {
		this.top = (7-this.row)*50+'px';
		this.left = (this.col)*50+'px';
	}
	else {
		this.left = (7-this.col)*50+'px';
		this.top = (this.row)*50+'px';
	}
	this.element.style.top = this.top;
	this.element.style.left = this.left;
	
}


Pieza.prototype.animateMove = function animateMove(){
	this.moved++;
	this.element.style.top = this.top;
	this.element.style.left = this.left;
	this.movedIn = this.handler.getMovedNumber()
}


Pieza.prototype.capturar = function capturar(to){
  this.state=0;
	this.element.setAttribute('state',0);
  this.col=-1;
  this.row=-1;
}

Pieza.prototype.remoteMove = function remoteMove(to){
	this.row=to[0];
	this.col=to[1];
	var orientacion = this.orientacion==this.handler.orientacion?this.handler.orientacion:this.orientacion;
	if (orientacion==1) {
		this.top = 50*(7-this.row)+'px';
		this.left = 50*this.col+'px';
	}
	else {
		this.top = 50*this.row+'px';
		this.left = 50*(7-this.col)+'px';
	}
	this.animateMove();
	
}

Pieza.prototype.mouseUp = function mouseUp(e,o,c){
	var ok=false;
	for (var i=0; i<this.pintados.length; ++i) {
		if (c.id == this.pintados[i]) {
			ok=true;
			break;
		}
	}
	for (var i=0; i<this.pintados.length; ++i) {
		d = document.getElementById(this.pintados[i]);
		if (d) d.style.border='solid transparent';
	}
	if (ok) {
		from = [this.row,this.col];
		
		var orientacion;
		
		orientacion=this.orientacion==this.handler.orientacion?this.handler.orientacion:this.orientacion;
		
		var r, c;
		r=+c.parentNode.getAttribute('row');;
		c=+c.getAttribute('col');
		if (orientacion==1) {
			this.row = 7-r;
			this.col = c;
		}
		else {
			this.row = r;
			this.col = 7-c;
		}
		
		if (!this.handler.handler.move(from,[this.row,this.col])) {
			this.row = from[0];
			this.col = from[1];
		
		}
		else {
			if (orientacion==1) {
				this.top = 50*(7-this.row)+'px';
				this.left = 50*(this.col)+'px';
			}
			else {
				this.top = 50*this.row+'px';
				this.left = 50*(7-this.col)+'px';
			}
			this.animateMove();
		}
	}
	this.pintados = [];
}

Pieza.prototype.clean = function clean(){
  this.setOriginalState();
  this.setState({state:0})
}

Pieza.prototype.setOriginalState = function setOriginalState(os){
  if (os) {
    os.row = 7-os.row
    for (var i in os) {
      this.originalState[i]=os[i];
    }
    if (os.row) {
      this.originalState.top = (7-os.row)*50+'px';
    }
    if (os.col);
      this.originalState.left = os.col*50+'px';
  }
  this.state = this.originalState.state;
  this.row = this.originalState.row;
  this.col = this.originalState.col;
  this.top = this.originalState.top;
  this.left = this.originalState.left;
  this.moved = this.originalState.moved;
  this.movedIn = this.originalState.movedIn;
  this.orientacion = this.originalState.orientacion;
  this.element.setAttribute('state',this.state);
  this.element.style.top = this.top;
	this.element.style.left = this.left;  
}

Pieza.prototype.mouseDown = function mouseDown(e,o){
  //chess.startCapturer()
	if (manageSessions.get('login')!=this.user)
		return;
	if (this.handler.handler.turno != this.color)
		return;
	var m = this.handler.handler.getMovimientos(this);
	this.selected=true;
	this.pintados=[];
	var d;
	var r,c;
	var orientacion;
	//if (this.orientacion==1 && this.handler.orientacion==1 )
	orientacion=this.orientacion==this.handler.orientacion?this.handler.orientacion:this.orientacion;
	for (var i=0; i<m.length; ++i) {
		r=orientacion==1?7-m[i][0]:m[i][0];
		c=orientacion==1?m[i][1]:7-m[i][1];
		this.pintados.push(this.idcasilla+r+'_'+c);
		d = document.getElementById(this.pintados[this.pintados.length-1]);
		if (d) d.style.border='solid red';
	}
	this.handler.handler.capturer(this);
}

Pieza.prototype.init = function init(eargs,oargs){
	this.pintados=[];
	this.movedIn=-10;
	eargs = eargs || {}
	var color = oargs.color == 'blancas' ? 'b':'n';
	if (color=='n') eargs.value*=-1;
	eargs.className = 'pieza';
	eargs.pcolor = oargs.color;
	eargs.top = (7-eargs.fila)*50+'px';
  var this_=this;
	eargs.src = 'images/'+eargs.name+color+'.png';
	eargs.left = eargs.columna*50+'px';
	eargs.parentNode = eargs.parentNode ? eargs.parentNode : $('div.container > div.tablero.grande')[0];
	this.element = sgCreateNode('DIV', eargs);
	this.element.onmousedown = function() {
    return this_.mouseDown(arguments[0],this);
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
	this.moved=0;

  this.originalState = {
    'state':this.state,
    'row':this.row,
    'col':this.col,
    'moved':this.moved,
    'movedIn':this.movedIn,
    'orientacion':this.orientacion,
    'top':this.top,
    'left':this.left
  }
}

function IPieza(){}

IPieza.prototype = new Pieza();

function RowChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'torre',
		value: 4,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id,
		
	}
	
	
	this.init(elemArgs,args);
}

RowChess.prototype = new Pieza();

function BishopChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'alfil',
		value: 3,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	
	this.init(elemArgs,args);
}

BishopChess.prototype = new Pieza();


function QueenChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'reina',
		value: 5,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	
	this.init(elemArgs,args);
}

QueenChess.prototype = new Pieza();

function KingChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'rey',
		value: 6,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	this.init(elemArgs,args);
}

KingChess.prototype = new Pieza();

KingChess.prototype.animateMove = function animateMove() {
	this.constructor.prototype.animateMove.call(this);
}
function HorseChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'caballo',
		value: 2,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	
	this.init(elemArgs,args);
}

HorseChess.prototype = new Pieza();

function PawnChess(){
	var args = arguments[0] || {}
	var elemArgs = {
		name: 'peon',
		value: 1,
		fila: args.row,
		columna: args.col,
		state: args.state,
		parentNode: args.parentNode?args.parentNode:$('div.container > div.tablero.grande')[0],
		id: args.id
	}
	
	
	this.init(elemArgs,args);
}

PawnChess.prototype = new Pieza();

PawnChess.prototype.move = function move() {

}

PawnChess.prototype.moves = function moves() {
  
}