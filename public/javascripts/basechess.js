function IBaseChess(){}

IBaseChess.prototype = new ISgControl()
IBaseChess.prototype.proto='ISgControl';
IBaseChess.prototype.lastAction;
IBaseChess.prototype.orientacion;
IBaseChess.prototype.matriz = [];
IBaseChess.prototype.blanco = {};
IBaseChess.prototype.negro = {};


IBaseChess.prototype.juegaSoli = function juegaSoli(value){
	if (value) {
    
	}

}

IBaseChess.prototype.onCasillaClick = function onCasillaClick(e,o){
  var img = rooms.rooms[this.roomid].editPanel.getElementsByClassName('selected')[0].children[0];
  this.selected = +img.getAttribute('value')
  if (+this.selected<0) {
    jugador='negro';
    or = -1;
    }
  else {
    or = 1;
    jugador='blanco';
  }
  var pieza = this[jugador].getAvailable(this.selected);
  if (!pieza) return;
  or = this[jugador].orientacion==pieza.originalState.orientacion?this[jugador].orientacion:pieza.orientacion;
	var r = +o.parentNode.getAttribute('row')
  var c = +o.getAttribute('col')
  // if (or==1)
    pieza.setOriginalState({row:r, col:c, orientacion: or, state:1, moved:0, movedIn:-10})
  // else
    // pieza.setOriginalState({row:r, col:7-c, orientacion: or, state:1, moved:0, movedIn:-10})
}

IBaseChess.prototype.restart = function restart(){
  this.editing=false;
  rooms.rooms[this.roomid].editPanel.setAttribute('state',0);
}

IBaseChess.prototype.onEditPanel = function onEditPanel(e,o){
  var img = rooms.rooms[this.roomid].editPanel.getElementsByClassName('selected')[0].children[0];
  img.src = o.src;
  img.setAttribute('value',o.getAttribute('value'));
  this.selected = +img.getAttribute('value')
}

IBaseChess.prototype.onCoronacion = function onCoronacion(e,o){
	this.divCoronacion.style.display='none';
	document.body.setAttribute('blurEffect',0);
	var jugador = this.infoCoronacion.color=='blancas' ? 'blanco' : 'negro';
	var pieza = this[jugador].addPieza(o.getAttribute('value'),this.infoCoronacion.to);
	this.matriz[pieza.row][pieza.col]=pieza.value;
	this.infoCoronacion.pieza = pieza.value;
	this.infoCoronacion.jugador = jugador;
	this.infoCoronacion.vj.pieza = pieza.value;
	this.move(this.infoCoronacion.from,this.infoCoronacion.to,false,this.infoCoronacion.pasarTurno,this.infoCoronacion.force,this.infoCoronacion);
}

IBaseChess.prototype.coronacion = function coronacion(from,to,ignore,pasarTurno,force,oncorona,color,c2,vj,original){
	this.divCoronacion.style.display='block';
	document.body.setAttribute('blurEffect',1);
	this.infoCoronacion.from=from;
	this.infoCoronacion.to=to;
	this.infoCoronacion.ignore=ignore;
	this.infoCoronacion.pasarTurno=pasarTurno;
	this.infoCoronacion.force=force;
	this.infoCoronacion.color=color;
	this.infoCoronacion.c2=c2;
	this.infoCoronacion.vj=vj;
	this.infoCoronacion.original=original;
	this.divCoronacion.setAttribute('color',color);
	
	
}

IBaseChess.prototype.clean = function clean(){
  this.resetMatriz();
  if (!this.blanco || !this.blanco.piezas) {
    this.NEGRAS=this.BLANCAS=manageSessions.get('login');
    this.acomodar();
  }
  
  this.blanco.clean();
  this.negro.clean();
  
}

IBaseChess.prototype.reset = function reset(){
  this.blanco.reset();
  this.negro.reset();
  this.turno = 'blancas';
  this.resetMatriz();
  for (var i in this.blanco.piezas) {
    for (var j=0; j<this.blanco.piezas[i].length; ++j) {
      if (this.blanco.piezas[i][j].pieza.state==1)
        this.matriz[this.blanco.piezas[i][j].pieza.row][this.blanco.piezas[i][j].pieza.col]=this.blanco.piezas[i][j].pieza.value
    }
  }
  for (var i in this.negro.piezas) {
    for (var j=0; j<this.negro.piezas[i].length; ++j) {
      if (this.negro.piezas[i][j].pieza.state==1)
        this.matriz[this.negro.piezas[i][j].pieza.row][this.negro.piezas[i][j].pieza.col]=this.negro.piezas[i][j].pieza.value
    }
  }
  this.jugada=1;
  this.ultimoMovimiento=[];
  this.redoBuffer=[];
  this.infoCoronacion={};
  this.jugadaInfo=[];
  this.infoCima=0;
  
}

IBaseChess.prototype.resetMatriz = function resetMatriz(){
	var v;
  if (this.matriz.length==0) {
    for (var i=0; i<8; ++i) {
      v=[];
      for (var j=0; j<8; ++j) {
        v.push('');
      }
      this.matriz.push(v);
    }
  }
  else
    for (var i=0; i<8; ++i) {
      for (var j=0; j<8; ++j) {
        this.matriz[i][j]='';
      }
    }
}

IBaseChess.prototype.getPiezas = function getPiezas(){
	return {blanco: this.blanco.piezas, negro: this.negro.piezas};
}

IBaseChess.prototype.getLastAction = function getLastAction(lastUpdate){
	return this.lastAction.slice(lastUpdate);
}

IBaseChess.prototype.onCaptured = function onCaptured(e,o){
		var c = o;
		chess.closeCapturer();
		var x = e.clientX, y = e.clientY, rect;
		var fila = -1, columna=-1;
		for (var i=0; i<8; ++i) {
			rect = (this.tablero.cells[i*8].getClientRects())[0];
			if (y>=rect.top && y<rect.bottom) {
				fila = i;
				break;
			}
		}
		if (fila!=-1)  {
			for (var i=0; i<8; ++i) {
				rect = (this.tablero.cells[fila*8+i].getClientRects())[0];
				if (x>=rect.left && x<rect.right) {
					columna = i;
					break;
				}
			}
		}
		var c;
		if (columna!=-1) {
			c = document.getElementById(this.idcasilla+fila+'_'+columna);
		}
		
		chess.captured.mouseUp(e,o,c);
		
	}

IBaseChess.prototype.setTurno = function setTurno(color){
    this.turno=color;
		// $('#'+color)[0].style.backgroundColor='#ddd';
    // if (color=='blancas') 
      // $('#negras')[0].style.backgroundColor='transparent';
    // else
      // $('#blancas')[0].style.backgroundColor='transparent';
    if (this[color]==this.user) {
      $('.container.chess')[0].setAttribute('active',color);
    }
    else
      $('.container.chess')[0].setAttribute('active',0);
  }

IBaseChess.prototype.isJaque = function isJaque(color,to){  
	var v=[], rey, jq=false;
	if (color == 'negras') {
		color='blanco';
		rey =this.negro.piezas.king[0].pieza;
	}
	else {
		rey =this.blanco.piezas.king[0].pieza;
		color='negro';
	}
	for (var i in this[color].piezas) {
		for (var j=0; j<this[color].piezas[i].length; ++j) {
			if (to[0]==this[color].piezas[i][j].pieza.row && to[1]==this[color].piezas[i][j].pieza.col)
        continue;
      if (this[color].piezas[i][j].pieza.state!=0)
				v = v.concat(this.getMovimientos(this[color].piezas[i][j].pieza));
		}
	}
	jq=false;
	for (var i=0; i<v.length; ++i) {
		if (rey.row==v[i][0] && rey.col==v[i][1]) {
			jq=true;
			break;
		}
	}
	return jq;
}

IBaseChess.prototype.capturarPieza = function capturarPieza(valor,posicion){
	var jugador = (valor<0) ? 'negro' : 'blanco';
	if (valor<0) valor =- valor;
	
	switch(valor) {
		case 1: pieza='pawn';break;
		case 2: pieza='horse';break;
		case 3: pieza='bishop';break;
		case 4: pieza='row';break;
		case 5: pieza='queen';break;
		case 6: pieza='king';break;
	}
	for (var i=0; i<this[jugador].piezas[pieza].length; ++i) {
		if (this[jugador].piezas[pieza][i].pieza.row == posicion[0]
				&& this[jugador].piezas[pieza][i].pieza.state==1 
        && this[jugador].piezas[pieza][i].pieza.col == posicion[1]) {
					this[jugador].piezas[pieza][i].pieza.capturar()
					return this[jugador].piezas[pieza][i].pieza;
				}
	}
}

IBaseChess.prototype.jaque = function jaque(){
	var color = this.turno=='blancas'? 'blanco':'negro';
	this[color].piezas.king[0].pieza.element.style.backgroundColor='red';
  this.inJaque = color;
	this.lastAction.push({action:'jaque'});
}

IBaseChess.prototype.capturer = function capturer(pieza){
	chess.captured=pieza;
	chess.idcasilla=this.idcasilla;
	chess.activeChess=this.chessid;
	chess.dcapturer.setAttribute('active','1');
	chess.dcapturer.setAttribute('activeChess',this.chessid);
  
	chess.dcapturer.onmouseup=function() {
		return chess.onCaptured(arguments[0],this);
	}
}	

IBaseChess.prototype.invertir = function invertir(){
	this.orientacion*=-1;
	this.tablero.invertir();
	this.negro.invertir();
	this.blanco.invertir();
}

IBaseChess.prototype.getMovimientosPeon = function getMovimientosPeon(pieza){
		var result = [];
		if (pieza.row==7 || pieza.row==0) return [];
		var orientacion = pieza.orientacion * pieza.handler.orientacion;
		if (this.matriz[pieza.row+1*orientacion][pieza.col]=='') 
			result.push([pieza.row+1*orientacion,pieza.col]);
		if (result.length && (pieza.row==1 && orientacion==1 || pieza.row==6 && orientacion==-1)) {
			if (this.matriz[pieza.row+2*orientacion][pieza.col]=='') {
				result.push([pieza.row+2*orientacion,pieza.col]);
			}
		}
		var o, r, c, p;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		if (pieza.col>0) {
			o = this.matriz[pieza.row+1*orientacion][pieza.col-1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*orientacion,pieza.col-1])
			o = this.matriz[pieza.row][pieza.col-1];
			if (o && o*sc<0 && o==-pieza.value) {
				p = this.getByCoord([pieza.row,pieza.col-1]);
				if (p.moved==1 && this.jugada - p.movedIn <=2 )
						result.push([pieza.row+1*orientacion,pieza.col-1,true,pieza.row,pieza.col-1])
			}
		}
		if (pieza.col<7) {
			o = this.matriz[pieza.row+1*orientacion][pieza.col+1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*orientacion,pieza.col+1])
			o = this.matriz[pieza.row][pieza.col+1];
			if (o && o*sc<0 && o==-pieza.value) {
				p = this.getByCoord([pieza.row,pieza.col+1]);
				if (p.moved==1 && this.jugada - p.movedIn <=2 )
					result.push([pieza.row+1*orientacion,pieza.col+1,true,pieza.row,pieza.col+1])
			}
		}
		return result;
	}

IBaseChess.prototype.getTocadosPeon = function getTocadosPeon(pieza){
		var result = [];
		var o;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		if (pieza.col>0) {
			o = this.matriz[pieza.row+1*pieza.orientacion][pieza.col-1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col-1])
		}
		if (pieza.col<7) {
			o = this.matriz[pieza.row+1*pieza.orientacion][pieza.col+1];
			if (o && o*sc<0) 
				result.push([pieza.row+1*pieza.orientacion,pieza.col+1])
		}			
		return result;
	}

IBaseChess.prototype.getMovimientosCaballo = function getMovimientosCaballo(pieza){
		var delta = [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]];
		var fil=pieza.row, col=pieza.col;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		for (var i=0; i<delta.length; ++i) {
			f=fil+delta[i][0];
			c=col+delta[i][1];
			if (f<0 || f>7 || c<0 || c>7) 
				continue;
			o = this.matriz[f][c];
			if (!o || o*sc<0) {
				result.push([f,c]);
			}
		}
		return result;
	
	}

IBaseChess.prototype.getMovimientosAlfil = function getMovimientosAlfil(pieza){
		var fil,col, f,c, o, seguir;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		var delta=[[1,1],[1,-1],[-1,1],[-1,-1]]
		for (var i=0; i<delta.length; ++i) {
			seguir=true;
			fil=pieza.row;
			col=pieza.col;
			
			while(seguir) {
				f=fil+delta[i][0];
				c=col+delta[i][1];
				if (f<0 || f>7 || c<0 || c>7) {
					seguir=false;
					break;
				}
				
				o = this.matriz[f][c];
				if (!o || o*sc<0) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

IBaseChess.prototype.getMovimientosTorre = function getMovimientosTorre(pieza){
		var fil,col, f,c, o, seguir;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		var delta=[[1,0],[-1,0],[0,1],[0,-1]]
		for (var i=0; i<delta.length; ++i) {
			seguir=true;
			fil=pieza.row;
			col=pieza.col;
			
			while(seguir) {
				f=fil+delta[i][0];
				c=col+delta[i][1];
				if (f<0 || f>7 || c<0 || c>7) {
					seguir=false;
					break;
				}
				
				o = this.matriz[f][c];
				if (!o || o*sc<0) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

IBaseChess.prototype.getMovimientosReina = function getMovimientosReina(pieza){
		var fil,col, f,c, o, seguir;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		var delta=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]
		for (var i=0; i<delta.length; ++i) {
			seguir=true;
			fil=pieza.row;
			col=pieza.col;
			
			while(seguir) {
				f=fil+delta[i][0];
				c=col+delta[i][1];
				if (f<0 || f>7 || c<0 || c>7) {
					seguir=false;
					break;
				}
				
				o = this.matriz[f][c];
				if (!o || o*sc<0) {
					result.push([f,c]);
					fil=f;
					col=c;
					if (o!=0)
						break;
				}
				else {
					break;
				}
				
				
			}
			
		}
		return result;
	}

IBaseChess.prototype.getMovimientosRey = function getMovimientosRey(pieza){
	var delta = [[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0]];
		var fil=pieza.row, col=pieza.col;
		var sc = (pieza.color=='blancas') ? 1 : -1;
		var result=[];
		for (var i=0; i<delta.length; ++i) {
			f=fil+delta[i][0];
			c=col+delta[i][1];
			if (f<0 || f>7 || c<0 || c>7) 
				continue;
			o = this.matriz[f][c];
			if (!o || o*sc<0) {
				result.push([f,c]);
			}
		}
		if (pieza.moved==0) {
			var jugador;
			if (pieza.color=='blancas') {
				jugador = 'blanco';
			}
			else {
				jugador = 'negro';
			}
			var c0;
			if (this[jugador].piezas.row[0].pieza.moved==0) {
				c0 = this[jugador].piezas.row[0].pieza.col;
				var ok=true;
				if (c0<pieza.col) {
					for (var i=1; i<pieza.col; ++i) {
						if (this.matriz[pieza.row][i]!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col-2]);
				}
				else {
					for (var i=6; i>pieza.col; --i) {
						if (this.matriz[pieza.row][i]!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col+2]);
				}
				if (ok) result.push([pieza.row, pieza.col-2]);
			}
			if (this[jugador].piezas.row[1].pieza.moved==0) {
				c0 = this[jugador].piezas.row[1].pieza.col;
				var ok=true;
				if (c0<pieza.col) {
					for (var i=1; i<pieza.col; ++i) {
						if (this.matriz[pieza.row][i]!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col-2]);
				}
				else {
					for (var i=6; i>pieza.col; --i) {
						if (this.matriz[pieza.row][i]!='') {
							ok=false;
							break;
						}
					}
					if (ok) result.push([pieza.row, pieza.col+2]);
				}
				
			}
			
		}
		return result;
	}

IBaseChess.prototype.getTocados = function getTocados(pieza){
		switch(pieza.name) {
			case 'peon': return this.getTocadosPeon(pieza);	 break;
			case 'caballo': return this.getMovimientosCaballo(pieza); break;
			case 'alfil': return this.getMovimientosAlfil(pieza); break;
			case 'torre': return this.getMovimientosTorre(pieza); break;
			case 'reina': return this.getMovimientosReina(pieza); break;
			case 'rey': return this.getMovimientosRey(pieza); break;
		}
	}

IBaseChess.prototype.getMovimientos = function getMovimientos(pieza){
		
		switch(pieza.name) {
			case 'peon': return this.getMovimientosPeon(pieza);	 break;
			case 'caballo': return this.getMovimientosCaballo(pieza); break;
			case 'alfil': return this.getMovimientosAlfil(pieza); break;
			case 'torre': return this.getMovimientosTorre(pieza); break;
			case 'reina': return this.getMovimientosReina(pieza); break;
			case 'rey': return this.getMovimientosRey(pieza); break;
		}
	}

IBaseChess.prototype.getByCoord = function getByCoord(from){
  var valor = this.matriz[from[0]][from[1]],
    jugador, pieza, v, np;
  if(valor>0) {
    jugador='blanco';
  }
  else {
    jugador='negro';
  }
  if (valor<0) valor=-valor
  switch(valor) {
    case 1: pieza='pawn'; break;
    case 2: pieza='horse'; break;
    case 3: pieza='bishop'; break;
    case 4: pieza='row'; break;
    case 5: pieza='queen'; break;
    case 6: pieza='king'; break;
  }
  var v=this[jugador].piezas[pieza];
  var np=-1;
  for (var i=0; i<v.length; ++i) {
    if (v[i].pieza.state==1 && v[i].pieza.row==from[0] && v[i].pieza.col==from[1]) {
      np=i;
      break;
    }
  }
  if (np>-1)
    return v[np].pieza;
  return null;
}

IBaseChess.prototype.getPawnFromByTo = function getPawnFromByTo(to,p,signo){
	if (p==='')
		p=to[1];
	else
		p=this.getColFromChar(p);
	var row = to[0],
			m = this.matriz[row][p];
	while (m != signo) {
		row-=signo;
		if (row<0 || row>7) return null;
		m = this.matriz[row][p];
	}
	return [row,p];
}

IBaseChess.prototype.getHorseFromByTo = function getHorseFromByTo(to,p,signo){
	var froms = [[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1]]
	var row, col;
	for (var i=0; i<8; ++i) {
		row = to[0]+froms[i][0];
		col = to[1]+froms[i][1];
		if (row<0 || row >7 || col<0 || col>7) 
			continue;
		if (this.matriz[row][col]==2*signo) {
			if (p=='')
				return [row,col];
			if (isNaN(p)) {
				if (p.charCodeAt(0)-97==col)
					return [row,col];
			}
			else {
				if (+p-1==row) {
					return [row,col];
				}
			}
		}
	}
	return null;
}

IBaseChess.prototype.getBishopFromByTo = function getBishopFromByTo(to,p,signo,queen){
	var deltas = [[-1,-1],[-1,1],[1,1],[1,-1]];
	var ii, jj, seguir, valor=queen?5:3;
	
	for (var i=0; i<4; ++i) {
		ii = to[0]-deltas[i][0];
		jj = to[1]-deltas[i][1];
		seguir=true;
		while (seguir) {
			if (ii>7 || ii<0 || jj>7 || jj<0)
				break;
			switch(this.matriz[ii][jj]) {
				case '': break;
				case valor*signo: 
					if (p=='')
						return [ii,jj];
					if (isNaN(p)) {
						if (p.charCodeAt(0)-97==jj)
							return [ii,jj];
					}
					else {
						if (+p-1==ii) {
							return [ii,jj];
						}
					}
				break;
				default:
					seguir=false;
				break;
			}
			ii-=deltas[i][0];
			jj-=deltas[i][1];
		}
	}
	return null;
}

IBaseChess.prototype.getRowFromByTo = function getRowFromByTo(to,p,signo,queen){
	var deltas = [[1,0],[-1,0],[0,-1],[0,1]];
	var ii, jj, seguir, valor=queen?5:4;
	for (var i=0; i<4; ++i) {
		ii = to[0]-deltas[i][0];
		jj = to[1]-deltas[i][1];
		seguir=true;
		while (seguir) {
			if (ii>7 || ii<0 || jj>7 || jj<0)
				break;
			switch(this.matriz[ii][jj]) {
				case '': break;
				case valor*signo: 
					if (p=='')
						return [ii,jj];
					if (isNaN(p)) {
						if (p.charCodeAt(0)-97==jj)
							return [ii,jj];
					}
					else {
						if (+p-1==ii) {
							return [ii,jj];
						}
					}
				break;
				default:
					seguir=false;
				break;
			}
			ii-=deltas[i][0];
			jj-=deltas[i][1];
		}
	}
	return null;
}

IBaseChess.prototype.getQueenFromByTo = function getQueenFromByTo(to,p,signo){
	var result = this.getBishopFromByTo(to,p,signo,true);
	return result ? result : this.getRowFromByTo(to,p,signo,true);
}

IBaseChess.prototype.getKingFromByTo = function getKingFromByTo(to,p,signo){
	var deltas =[[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
	for (var i=0; i<8; ++i) {
		row = to[0]-deltas[i][0];
		col = to[1]-deltas[i][1];
		if (row<0 || row>7 || col<0 || col>7)
			continue;
		if (this.matriz[row][col]==6*signo) {
			return [row,col];
		}
	}
	return null;
}

IBaseChess.prototype.getFromByTo = function getFromByTo(to,p,signo){
	switch(p) {
		case '':
		case 'a':
		case 'b':
		case 'c':
		case 'd':
		case 'e':
		case 'f':
		case 'g':
		case 'h':
			return this.getPawnFromByTo(to,p,signo);
		break;
	}
	var discriminante=''
	if (p.length==2) {
		discriminante=p.charAt(1);
	}
	switch(p.charAt(0)) {
		case 'C': return this.getHorseFromByTo(to,discriminante,signo); break;
		case 'A': return this.getBishopFromByTo(to,discriminante,signo); break;
		case 'T': return this.getRowFromByTo(to,discriminante,signo); break;
		case 'D': return this.getQueenFromByTo(to,discriminante,signo); break;
		case 'R': return this.getKingFromByTo(to,discriminante,signo); break;
	}
}

IBaseChess.prototype.getColFromChar = function getColFromChar(s){
	return s.charCodeAt(0)-97;
}

IBaseChess.prototype.parseDestino = function parseDestino(s){
	return  [+(s.charAt(1))-1,this.getColFromChar(s.charAt(0))];

}

IBaseChess.prototype.unredo = function redo(){
	var info = this.redoBuffer.pop(), pieza;
	this.jugadaInfo.push(info);
	for (var i=0; i<info.length; ++i) {
		pieza = this.getByCoord(info[i].from);
		pieza.remoteMove(info[i].to);
		this.matriz[info[i].to[0]][info[i].to[1]]=this.matriz[info[i].from[0]][info[i].from[1]]
		this.matriz[info[i].from[0]][info[i].from[1]]='';
	}
}

IBaseChess.prototype.redo = function redo(){
	var info = this.jugadaInfo.pop();
	this.redoBuffer.push(info);
	this.jugada--;
	
	for (var i=0; i<info.length; ++i) {
		var pieza = this.getByCoord(info[i].to);
		pieza.remoteMove(info[i].from);
		this.setTurno(info[i].color);
		if (info[i].capturada) {
			info[i].capturada.state=1;
			info[i].capturada.element.setAttribute('state',1);
			info[i].capturada.row=info[i].to[0];
			info[i].capturada.col=info[i].to[1];
		}
		if (this.animating) {
			if (--chess.animateParams.j0<0) {
				chess.animateParams.j0=1;
				--chess.animateParams.i0;
			}
		}
		this.matriz[info[i].from[0]][info[i].from[1]]=this.matriz[info[i].to[0]][info[i].to[1]];
		this.matriz[info[i].to[0]][info[i].to[1]]=info[i].captura;
		}
	
	
}


IBaseChess.prototype.getMovedNumber = function getMovedNumber(){
	return this.jugada;
}

IBaseChess.prototype.yellowRemark = function yellowRemark(){
	if (!this.ultimoMovimiento) this.ultimoMovimiento=[];
	if (!arguments[0]) {
		while(this.ultimoMovimiento.length) {
			var du=this.ultimoMovimiento.pop();
			document.getElementById(du).style.borderColor='transparent';
		}
	}
	else {
		this.ultimoMovimiento.push(arguments[0]);
		document.getElementById(arguments[0]).style.borderColor='yellow';
	}
}

IBaseChess.prototype.acomodar = function acomodar(){
	var rb=1, rb1=0, rn=6, rn1=7;
	// if (this.blanco && this.blanco.color)
		// return;
	this.jugadaInfo=[];
	this.jugada=1;
  // var piezas = {
    // negras:{
      // pawn:[{row:3,col:5,state:1},
          // {row:2,col:6,state:1}],
      // king:
					// [{row:1,col:6,state:1}],
// row:					[{row:rn1,col:0,state:0},
						// {row:rn1,col:7,state:0} ]    
      // },
     // blancas:{
      // horse:[{row:1,col:5,state:1}],
      // queen:[{row:1,col:1,state:1}],
      // row:[{row:7,col:6,state:1},
            // {row:rn1,col:7,state:0}],
						
      
      // king:[{row:6,col:2,state:1}]
     // }
          
   // }
	 
  
	var piezas = {
		blancas:{
			pawn:[{row:rb,col:0,state:1},
						{row:rb,col:1,state:1},
						{row:rb,col:2,state:1},
						{row:rb,col:3,state:1},
						{row:rb,col:4,state:1},
						{row:rb,col:5,state:1},
						{row:rb,col:6,state:1},
						{row:rb,col:7,state:1}
						],
			horse:[
						{row:rb1,col:1,state:1},
						{row:rb1,col:6,state:1}
						],
			bishop:[
						{row:rb1,col:2,state:1},
						{row:rb1,col:5,state:1}
			],
			row:[
						{row:rb1,col:0,state:1},
						{row:rb1,col:7,state:1}
			],
			queen:[
						{row:rb1,col:3,state:1}
			],
			king:[
						{row:rb1,col:4,state:1}
			]
		},
		negras:{
			pawn:[{row:rn,col:0,state:1},
						{row:rn,col:1,state:1},
						{row:rn,col:2,state:1},
						{row:rn,col:3,state:1},
						{row:rn,col:4,state:1},
						{row:rn,col:5,state:1},
						{row:rn,col:6,state:1},
						{row:rn,col:7,state:1}
						],
			horse:[
						{row:rn1,col:1,state:1},
						{row:rn1,col:6,state:1}
						],
			bishop:[
						{row:rn1,col:2,state:1},
						{row:rn1,col:5,state:1}
			],
			row:[
						{row:rn1,col:0,state:1},
						{row:rn1,col:7,state:1}
			],
			queen:[
						{row:rn1,col:3,state:1}
			],
			king:[
						{row:rn1,col:4,state:1}
			]
		}
	}
	var k;
	
	
	this.matriz = [];
	var vr;
	for (var i=0; i<8; ++i) {
		vr = [];
		for (var j=0; j<8; ++j) {
			vr.push('');
		}
		this.matriz.push(vr)
	}
	for (var i in piezas) {
		m=(i=='blancas')?1:-1;
		for (var j in piezas[i]) {
			switch(j) {
				case 'pawn': n=1; break;
				case 'horse': n=2; break;
				case 'bishop': n=3; break;
				case 'row': n=4; break;
				case 'queen': n=5; break;
				case 'king': n=6; break;
			}
			for (var k=0; k<piezas[i][j].length; ++k) {
				this.matriz[piezas[i][j][k].row][piezas[i][j][k].col] = n*m;
			}
		}
		
	}
	return piezas;
}

IBaseChess.prototype.init = function init(){
		window[IBaseChess.prototype.proto].prototype.init.call(this,arguments[0],{
			eargs:{display:'block', className:arguments[0].eargs.className || 'container chess'},
			orags:{jugada:1, innited:true, tablero:{}, orientacion:1}
		})
		this.infoCoronacion={};
		this.infoCima=0;
		this.redoBuffer=[];
		this.jugadaInfo=[];
		this.ultimoMovimiento=[];
		this.lastAction = [];
		this.num = this.num || '';
		this.idcasilla=this.roomid+'_'+this.num+'_'+'casilla_';
		this.tablero = new Tablero({
			eargs : {
				parentNode: arguments[0].parentNode? arguments[0].parentNode : this.element,
				nplayers: 2
			},
			oargs : {
				handler: this,
				idcasilla: this.idcasilla
			},
			common : {
				id : 'tablero_'+this.roomid+'_'+this.chessid
			}
		})
		this.divCoronacion = document.createElement('DIV');
		this.divCoronacion.className='coronacion';
		var html = '';
		html += '<div class="blur">';
		html += '</div>';
		html += '<div class="blancas">';
		html += 	'<img value="2" src="images/caballob.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="3" src="images/alfilb.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="4" src="images/torreb.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="5" src="images/reinab.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += '</div>';
		html += '<div class="negras">';
		html += 	'<img value="-2" src="images/caballon.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="-3" src="images/alfiln.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="-4" src="images/torren.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += 	'<img value="-5" src="images/reinan.png" onclick="chess.onCoronacion(event,this,\''+this.chessid+'\')"  />';
		html += '</div>';
		this.divCoronacion.innerHTML = html;
		document.body.appendChild(this.divCoronacion);
		
		var this_=this;
    $.ajax("jugadores", {
   "type": "get",   // usualmente post o get
   "success": function(result) {
     //this_.init1(result);
   },
   "error": function(result) {
     console.error("Este callback maneja los errores", result);
   },
   "async": true,
  });
	this.turno = 'blancas',
    this.user=manageSessions.get("login");
		chess.init();
  }


function BaseChess(){
}
